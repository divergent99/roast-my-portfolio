from fastapi import APIRouter, File, UploadFile, Form
from anthropic import Anthropic
import base64, json, os

router = APIRouter()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def build_system_prompt(settings: dict) -> str:
    persona = settings.get("persona", "Ruthless VC")
    vibe = settings.get("vibe", "Savage")
    language = settings.get("language", "English")
    intensity = settings.get("intensity", 7)
    response_length = settings.get("responseLength", "Full Roast")
    portfolio_type = settings.get("portfolioType", "Stocks")
    risk_appetite = settings.get("riskAppetite", "Moderate")
    experience_level = settings.get("experienceLevel", "Noob")
    show_real_talk = settings.get("showRealTalk", True)

    length_guide = {
        "Short Burn": "Keep it under 150 words. Fast, punchy, devastating.",
        "Full Roast": "200-400 words. Full breakdown with multiple points.",
        "Essay Mode": "400+ words. Go deep on every holding. Be thorough and merciless."
    }.get(response_length, "200-400 words.")

    real_talk = """After the roast, add a "Real Talk:" section with 2-3 genuine actionable insights.""" if show_real_talk else "Do not add any genuine advice. Pure roast only."

    return f"""You are a portfolio roaster with the persona of a "{persona}".
Your vibe is "{vibe}" and your roast intensity is {intensity}/10.
Respond exclusively in {language}.

Context about this portfolio:
- Type: {portfolio_type}
- User's risk appetite: {risk_appetite}
- Experience level: {experience_level}

Response length: {length_guide}

When given a portfolio screenshot:
1. Identify the holdings, quantities, and performance visible in the image
2. ROAST them based on your persona, vibe, and intensity
3. Tailor the roast to their experience level -- be more educational for Noobs, more technical for Pros
4. Factor in their risk appetite when judging their choices
{real_talk}
{"5. End with 'Portfolio Score: X/10'" if show_real_talk else ""}

Rules:
- DO NOT use emojis unless the user explicitly asks
- Do NOT make up holdings -- only roast what is visible
- Stay in character for follow-up questions
- Adjust language/slang to match the persona naturally"""



def build_messages(messages_list: list, image_data: bytes | None, media_type: str | None) -> list:
    anthropic_messages = []

    if image_data:
        b64 = base64.standard_b64encode(image_data).decode("utf-8")
        anthropic_messages.append({
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type or "image/png",
                        "data": b64
                    }
                },
                {
                    "type": "text",
                    "text": "Roast my portfolio. Be brutal."
                }
            ]
        })
    else:
        for msg in messages_list:
            if msg["role"] in ("user", "assistant"):
                anthropic_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

    return anthropic_messages


@router.post("/chat")
async def chat(
    messages: str = Form(...),
    settings: str = Form(...),
    image: UploadFile = None
):
    messages_list = json.loads(messages)
    settings_dict = json.loads(settings)

    image_data = None
    media_type = None
    if image:
        image_data = await image.read()
        media_type = image.content_type or "image/png"

    system = build_system_prompt(settings_dict)
    anthropic_messages = build_messages(messages_list, image_data, media_type)

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=system,
        messages=anthropic_messages
    )

    return {"response": response.content[0].text}