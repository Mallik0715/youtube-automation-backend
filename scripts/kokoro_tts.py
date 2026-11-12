"""Backup voice engine: Kokoro, an open-source TTS model that runs on this machine (no internet service).

Used when Microsoft's edge-tts refuses requests (it sometimes blocks GitHub's servers).
    python scripts/kokoro_tts.py --voice am_michael --speed 1.05 --text "Hello" --out line.wav
Voices: a* = American English, b* = British English (af_/bf_ female, am_/bm_ male).
The model (~330 MB) downloads from Hugging Face on first use and is cached after that.
"""
import argparse
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--voice", required=True)
    p.add_argument("--speed", type=float, default=1.0)
    p.add_argument("--text", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()

    lang = "b" if a.voice.startswith("b") else "a"
    pipeline = KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
    chunks = [audio for _, _, audio in pipeline(a.text, voice=a.voice, speed=a.speed) if audio is not None]
    if not chunks:
        sys.exit("kokoro produced no audio")
    sf.write(a.out, np.concatenate([np.asarray(c) for c in chunks]), 24000)


if __name__ == "__main__":
    main()
