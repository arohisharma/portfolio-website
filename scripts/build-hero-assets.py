#!/usr/bin/env python3
"""
build-hero-assets.py
=====================

Turns the raw intro clip + headshot photo into the loopable hero video
(public/hero/hero.mp4 + hero.webm) and the static portrait images
(public/portrait-bust.webp + public/og.jpg) used by the site.

Pipeline for the video:
  1.  Decode the first ~10s of the source clip, crop it tightly around the
      person and scale it to 768px wide (ffmpeg does the decode/crop/scale,
      numpy does everything pixel-level below).
  2.  Remove the background. The source clip is shot in front of a very
      light, slightly uneven backdrop (not a flat chroma colour), so instead
      of a single chroma-key colour we key on "high lightness + low
      saturation" per pixel (soft threshold, smoothstep falloff for
      anti-aliased edges) and composite the result onto pure white. That
      both erases the backdrop and produces the flat-white background the
      <Hero> component expects for its `mix-blend-mode: multiply` trick.
  3.  Build a seamless loop. Using the classic "blend the tail into the
      head" recipe (the same thing ffmpeg's `xfade` filter does, implemented
      by hand in numpy so the exact same alpha ramp can be reused for the
      audio): the final clip is `main + blended`, where `main` is the clip
      minus the last `overlap` frames, and `blended` cross-fades the true
      ending into the true beginning over `overlap` frames. The same ramp is
      applied sample-accurately to the PCM audio (never ffmpeg's
      `acrossfade`, which can drop samples at the boundary).
  4.  Mux the processed frames with the processed audio and encode:
        - hero.mp4  : H.264 yuv420p (CRF 24, preset slow) + AAC 96kbps, +faststart
        - hero.webm : VP9 (CRF 36) + Opus 80kbps

Pipeline for the stills:
  - portrait-bust.webp: a 480x600 head-to-shirt crop of the supplied photo.
  - og.jpg: a 1200x630 crop/pad of the same photo for social previews.

Requirements: ffmpeg + ffprobe on PATH, numpy, Pillow. No GPU/ML deps.

Usage:
    python3 scripts/build-hero-assets.py \\
        --video assets-src/intro.mp4 \\
        --photo assets-src/headshot.jpg \\
        --crop 720:900:0:30 \\
        --loop-seconds 10 --overlap-ms 500

Run with --help for all options including manual crop overrides.
"""

from __future__ import annotations

import argparse
import json
import shutil
import struct
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_VIDEO = ROOT / "assets-src" / "Developer_introduces_web_applica…_20261013135940.mp4"
DEFAULT_PHOTO = ROOT / "assets-src" / "49BC0771-B00A-4189-BEE4-7A59C01D7B39.jpg"
HERO_DIR = ROOT / "public" / "hero"
PUBLIC_DIR = ROOT / "public"


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, **kwargs)


def ffprobe_json(path: Path) -> dict:
    out = subprocess.run(
        [
            "ffprobe", "-v", "error", "-print_format", "json",
            "-show_format", "-show_streams", str(path),
        ],
        check=True, capture_output=True, text=True,
    )
    return json.loads(out.stdout)


# ---------------------------------------------------------------------------
# Step 1-2: decode + crop + scale (ffmpeg) then background removal (numpy)
# ---------------------------------------------------------------------------

def decode_cropped_frames(
    video: Path, crop: str, width: int, fps: int, seconds: float
) -> tuple[np.ndarray, int, int]:
    """Decode `seconds` of video, cropped by `crop` (w:h:x:y), scaled to
    `width` px wide, and return an (N, H, W, 3) uint8 array at `fps`."""
    probe = ffprobe_json(video)
    vstream = next(s for s in probe["streams"] if s["codec_type"] == "video")
    src_w, src_h = int(vstream["width"]), int(vstream["height"])
    crop_w, crop_h, crop_x, crop_y = (int(v) for v in crop.split(":"))
    out_h = round(crop_h * width / crop_w)
    if out_h % 2:
        out_h += 1

    vf = f"crop={crop_w}:{crop_h}:{crop_x}:{crop_y},scale={width}:{out_h},fps={fps}"
    cmd = [
        "ffmpeg", "-v", "error", "-i", str(video),
        "-t", str(seconds), "-vf", vf,
        "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ]
    proc = subprocess.run(cmd, check=True, capture_output=True)
    frame_bytes = width * out_h * 3
    n = len(proc.stdout) // frame_bytes
    arr = np.frombuffer(proc.stdout[: n * frame_bytes], dtype=np.uint8)
    arr = arr.reshape(n, out_h, width, 3).copy()
    print(f"  decoded {n} frames at {width}x{out_h} "
          f"(source {src_w}x{src_h}, crop {crop})")
    return arr, width, out_h


def smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def background_mask(
    frames: np.ndarray,
    light_range: tuple[float, float] = (210.0, 235.0),
    sat_range: tuple[float, float] = (18.0, 30.0),
) -> np.ndarray:
    """Per-pixel background score in [0, 1] for a light, low-saturation backdrop."""
    out = frames.astype(np.float32)
    mx = out.max(axis=-1)
    mn = out.min(axis=-1)
    sat = mx - mn
    light = mx
    light_score = smoothstep(light_range[0], light_range[1], light)
    sat_score = 1.0 - smoothstep(sat_range[0], sat_range[1], sat)
    return np.clip(light_score * sat_score, 0.0, 1.0)


def remove_background_to_white(
    frames: np.ndarray,
    light_range: tuple[float, float] = (210.0, 235.0),
    sat_range: tuple[float, float] = (18.0, 30.0),
) -> np.ndarray:
    """Key out a light, low-saturation backdrop and composite onto pure
    white. Works on a stack of frames (N, H, W, 3) uint8, returns the same
    shape. `sat_range` is (fully-foreground, fully-background) so the score
    ramps the opposite way from `light_range`."""
    out = frames.astype(np.float32)
    bg_score = background_mask(frames, light_range, sat_range)[..., None]
    white = np.full_like(out, 255.0)
    blended = out * (1.0 - bg_score) + white * bg_score
    return np.clip(blended, 0, 255).astype(np.uint8)


def remove_background_to_rgba(
    frames: np.ndarray,
    light_range: tuple[float, float] = (210.0, 235.0),
    sat_range: tuple[float, float] = (18.0, 30.0),
) -> np.ndarray:
    """Return (N, H, W, 4) uint8 RGBA with a transparent backdrop."""
    bg = background_mask(frames, light_range, sat_range)
    alpha = np.clip(1.0 - bg, 0.0, 1.0)
    rgb = frames.astype(np.float32)
    rgba = np.concatenate([rgb, alpha[..., None] * 255.0], axis=-1)
    return np.clip(rgba, 0, 255).astype(np.uint8)


# ---------------------------------------------------------------------------
# Step 3: seamless loop (shared ramp for video frames + audio samples)
# ---------------------------------------------------------------------------

def crossfade_loop(stack: np.ndarray, overlap: int) -> np.ndarray:
    """stack: (N, ...) array of frames or audio samples. Returns a
    seamlessly-loopable (N - overlap, ...) array using the
    main + blend(tail -> head) recipe."""
    n = stack.shape[0]
    main = stack[: n - overlap]
    tail = stack[n - overlap:].astype(np.float32)
    head = stack[:overlap].astype(np.float32)

    ramp_shape = (overlap,) + (1,) * (stack.ndim - 1)
    t = np.linspace(0.0, 1.0, overlap, endpoint=False).reshape(ramp_shape)
    blended = tail * (1.0 - t) + head * t
    blended = np.clip(blended, np.iinfo(stack.dtype).min if np.issubdtype(stack.dtype, np.integer) else -1e9,
                       np.iinfo(stack.dtype).max if np.issubdtype(stack.dtype, np.integer) else 1e9)
    blended = blended.astype(stack.dtype)
    return np.concatenate([main, blended], axis=0)


def read_pcm(video: Path, seconds: float, sample_rate: int) -> np.ndarray:
    cmd = [
        "ffmpeg", "-v", "error", "-i", str(video),
        "-t", str(seconds), "-vn",
        "-ar", str(sample_rate), "-ac", "2",
        "-f", "s16le", "pipe:1",
    ]
    proc = subprocess.run(cmd, check=True, capture_output=True)
    samples = np.frombuffer(proc.stdout, dtype="<i2")
    n = len(samples) // 2
    return samples[: n * 2].reshape(n, 2).copy()


def write_wav(path: Path, samples: np.ndarray, sample_rate: int) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        w.writeframes(samples.astype("<i2").tobytes())


# ---------------------------------------------------------------------------
# Step 4: encode
# ---------------------------------------------------------------------------

def encode(frames: np.ndarray, audio_wav: Path, fps: int, out_path: Path, codec: str) -> None:
    n, h, w, channels = frames.shape
    if channels not in (3, 4):
        raise ValueError(f"expected 3 or 4 channels, got {channels}")
    pix_fmt = "rgba" if channels == 4 else "rgb24"
    raw_path = out_path.with_suffix(".raw")
    frames.tofile(raw_path)
    try:
        if codec == "h264":
            if channels != 3:
                raise ValueError("h264 path expects RGB frames composited onto white")
            vcodec = ["-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p"]
            acodec = ["-c:a", "aac", "-b:a", "96k"]
            extra = ["-movflags", "+faststart"]
        elif codec == "vp9":
            vcodec = [
                "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
                "-pix_fmt", "yuva420p" if channels == 4 else "yuv420p",
            ]
            acodec = ["-c:a", "libopus", "-b:a", "80k"]
            extra = []
        else:
            raise ValueError(codec)

        cmd = [
            "ffmpeg", "-y", "-v", "error",
            "-f", "rawvideo", "-pix_fmt", pix_fmt, "-s", f"{w}x{h}", "-r", str(fps),
            "-i", str(raw_path),
            "-i", str(audio_wav),
            "-map", "0:v", "-map", "1:a",
            *vcodec, *acodec, *extra,
            str(out_path),
        ]
        run(cmd)
        print(f"  wrote {out_path} ({out_path.stat().st_size / 1024:.0f} KB)")
    finally:
        raw_path.unlink(missing_ok=True)


# ---------------------------------------------------------------------------
# Stills
# ---------------------------------------------------------------------------

def center_crop(img: Image.Image, target_w: int, target_h: int, focus_y: float = 0.38) -> Image.Image:
    """Crop to target aspect ratio, keeping `focus_y` (0=top..1=bottom) of
    the source roughly at the same fraction of the output (good for
    head-and-shoulders photos where the face sits above centre)."""
    src_w, src_h = img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        # source is wider than target -> crop width
        new_w = round(src_h * target_ratio)
        x0 = max(0, min(src_w - new_w, round((src_w - new_w) / 2)))
        box = (x0, 0, x0 + new_w, src_h)
    else:
        # source is taller than target -> crop height, biased toward focus_y
        new_h = round(src_w / target_ratio)
        ideal_y0 = round(src_h * focus_y - new_h * focus_y)
        y0 = max(0, min(src_h - new_h, ideal_y0))
        box = (0, y0, src_w, y0 + new_h)

    cropped = img.crop(box)
    return cropped.resize((target_w, target_h), Image.LANCZOS)


def build_portrait_stills(photo: Path) -> None:
    img = Image.open(photo).convert("RGB")

    bust = center_crop(img, 480, 600, focus_y=0.34)
    bust_path = PUBLIC_DIR / "portrait-bust.webp"
    bust.save(bust_path, "WEBP", quality=92, method=6)
    print(f"  wrote {bust_path}")

    og = center_crop(img, 1200, 630, focus_y=0.30)
    canvas = Image.new("RGB", (1200, 630), (244, 242, 238))
    canvas.paste(og, (0, 0))
    og_path = PUBLIC_DIR / "og.jpg"
    canvas.save(og_path, "JPEG", quality=90)
    print(f"  wrote {og_path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--video", type=Path, default=DEFAULT_VIDEO, help="source intro clip")
    parser.add_argument("--photo", type=Path, default=DEFAULT_PHOTO, help="source headshot photo")
    parser.add_argument("--crop", default="720:900:0:30", help="ffmpeg crop as w:h:x:y of the source video")
    parser.add_argument("--width", type=int, default=768, help="output width in px")
    parser.add_argument("--fps", type=int, default=24)
    parser.add_argument("--loop-seconds", type=float, default=10.0, help="seconds of source to use")
    parser.add_argument("--overlap-ms", type=float, default=500.0, help="crossfade overlap in ms")
    parser.add_argument("--skip-video", action="store_true")
    parser.add_argument("--skip-stills", action="store_true")
    args = parser.parse_args()

    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        sys.exit("ffmpeg/ffprobe not found on PATH")

    HERO_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    if not args.skip_video:
        if not args.video.exists():
            sys.exit(f"video not found: {args.video}")
        print(f"[1/4] decoding + cropping {args.video.name}")
        frames, w, h = decode_cropped_frames(args.video, args.crop, args.width, args.fps, args.loop_seconds)

        print("[2/4] removing background (alpha + white fallback)")
        frames_rgba = remove_background_to_rgba(frames)
        frames_white = remove_background_to_white(frames)

        overlap = round(args.overlap_ms / 1000.0 * args.fps)
        sample_rate = 48000
        overlap_samples = round(args.overlap_ms / 1000.0 * sample_rate)

        print(f"[3/4] building seamless loop (overlap {overlap} frames / {overlap_samples} samples)")
        looped_rgba = crossfade_loop(frames_rgba, overlap)
        looped_white = crossfade_loop(frames_white, overlap)
        pcm = read_pcm(args.video, args.loop_seconds, sample_rate)
        looped_audio = crossfade_loop(pcm, overlap_samples)

        tmp_wav = HERO_DIR / "_tmp_audio.wav"
        write_wav(tmp_wav, looped_audio, sample_rate)

        print("[4/4] encoding hero.webm (alpha) + hero.mp4 (white fallback)")
        encode(looped_rgba, tmp_wav, args.fps, HERO_DIR / "hero.webm", "vp9")
        encode(looped_white, tmp_wav, args.fps, HERO_DIR / "hero.mp4", "h264")
        tmp_wav.unlink(missing_ok=True)

        loop_seconds = looped_rgba.shape[0] / args.fps
        print(f"  loop duration: {loop_seconds:.2f}s")
    else:
        print("skipping video (--skip-video)")

    if not args.skip_stills:
        if not args.photo.exists():
            sys.exit(f"photo not found: {args.photo}")
        print("building portrait-bust.webp + og.jpg from photo")
        build_portrait_stills(args.photo)
    else:
        print("skipping stills (--skip-stills)")

    print("done.")


if __name__ == "__main__":
    main()
