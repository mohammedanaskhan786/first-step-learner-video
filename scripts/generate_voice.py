import asyncio
import os
import edge_tts

VOICE = "en-US-ChristopherNeural"
RATE = "-5%"
VOLUME = "+0%"

INPUT_FILE = "narration.txt"
OUTPUT_FILE = "public/audio/narration.mp3"


async def generate_voice():
    if not os.path.exists(INPUT_FILE):
        raise FileNotFoundError(
            f"Missing {INPUT_FILE}. Please add your English narration script."
        )

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        text = f.read().strip()

    if not text:
        raise ValueError("narration.txt is empty.")

    os.makedirs("public/audio", exist_ok=True)

    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        volume=VOLUME,
    )

    await communicate.save(OUTPUT_FILE)

    print(f"Voiceover generated successfully: {OUTPUT_FILE}")


if __name__ == "__main__":
    asyncio.run(generate_voice())
