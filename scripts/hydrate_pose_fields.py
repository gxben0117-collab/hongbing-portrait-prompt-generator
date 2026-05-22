from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "index.html"


CATEGORY_POSE_LIBRARY = {
    "travel": {
        "prop": [
            "Choose an action that fits a real traveler in this location: walking through the site, pausing to take in the view, touching a railing or architectural detail, adjusting hat or coat against wind, or calmly turning back toward the camera after interacting with the environment",
            "The subject should behave like someone genuinely experiencing the place rather than posing generically: sight-seeing, arriving, pausing, turning, or quietly responding to the weather, landscape, or landmark around her",
            "Use a location-driven travel moment with natural narrative intent, such as stepping along the path, standing at an overlook, waiting by water, touching a lantern, or looking back after moving through the scene, while preserving clear facial readability",
        ],
        "comp": [
            "vertical environmental travel portrait, subject clearly readable within the location, face unobstructed, body slightly angled for motion, background landmark still recognizable",
            "vertical three-quarter or full-body travel composition, natural walking or turn-back storytelling, clear facial visibility, foreground and background layered for depth",
        ],
    },
    "wedding": {
        "prop": [
            "Choose an action that feels true to a bride in this exact setting: adjusting veil before the ceremony, holding bouquet while waiting, smoothing the gown, stepping through the aisle or garden, or turning gently after hearing someone call to her",
            "The subject should behave like she is inside a wedding moment rather than merely modeling the dress: preparing, entering, pausing in emotion, gathering the skirt, or quietly responding to the space with romantic presence",
            "Use bridal narrative intent such as walking into the venue, sitting for a calm in-between moment, touching veil or bouquet naturally, or sharing a private reflective pause, while keeping face and identity clean and stable",
        ],
        "comp": [
            "vertical bridal portrait with clear face, readable gown silhouette, and soft foreground layering from flowers, veil, or fabric without obscuring the subject",
            "vertical three-quarter to full-body wedding composition, face large enough to preserve identity, skirt and train clearly visible, elegant depth behind the subject",
        ],
    },
    "hanfu": {
        "prop": [
            "Choose an action that matches the character identity and historical atmosphere: listening to music, reading a letter, carrying a lantern, holding a fan, touching a sleeve, drawing near a railing, offering tea, walking through a corridor, or resting a hand near a sword hilt if the role is martial",
            "The subject should feel like a person living inside the classical scene rather than a generic costume model: court lady waiting, scholar beauty pausing, traveler crossing a pavilion, noblewoman turning after hearing footsteps, or warrior heroine preparing to move",
            "Use culturally and role-appropriate behavior driven by the scene: not random gesturing, but a calm action with purpose, social meaning, or emotional context, while preserving a front-face-friendly body relationship",
        ],
        "comp": [
            "vertical classical portrait with clear face, readable sleeve and hair ornament details, and elegant three-quarter body angle instead of flat frontal stiffness",
            "vertical full-body or three-quarter hanfu composition, costume layers and silhouette clearly visible, traditional prop integrated without covering the face",
        ],
    },
    "queen": {
        "prop": [
            "Choose an action that fits a ruler, sovereign, goddess, or demon queen in this scene: receiving an audience, issuing a command, reviewing a decree, rising from the throne, descending ceremonial steps, resting a hand on a scepter or throne arm, or turning after hearing urgent news",
            "The subject should feel like she holds power inside the world of the image rather than simply striking a strong pose: governing, judging, commanding, blessing, threatening, or presiding over the space with calm authority",
            "Use behavior with role logic and narrative weight, such as ruling, deciding, summoning, or presiding, while keeping the body stable, the face readable, and the authority conveyed through action rather than exaggerated gesture alone",
        ],
        "comp": [
            "vertical regal portrait with throne, steps, or architectural axis reinforcing authority, face clearly readable, body posed in a stable commanding silhouette",
            "vertical queenly composition with subtle low angle or central axis, strong facial clarity, costume and power symbols fully legible without overcomplicated action",
        ],
    },
    "fantasy": {
        "prop": [
            "Choose a fantasy action that fits the creature, magic system, or world logic: summoning, listening to a spirit, touching enchanted water, guiding floating light, watching a portal open, or responding to a supernatural presence with believable intent",
            "The subject should act like she belongs to a magical world, not like a fashion model in costume: casting, waiting, invoking, discovering, protecting, or reacting to the environment with role-appropriate purpose",
            "Use a magical but readable action with story logic, such as holding a relic, reaching toward a phenomenon, moving through ruins, or quietly controlling an unseen force, while preserving stable face-body coherence",
        ],
        "comp": [
            "vertical fantasy portrait with clear face, readable magical subject silhouette, and layered supernatural environment supporting the action without overwhelming the identity",
            "vertical three-quarter or full-body fantasy composition, face unobstructed, magic effects orbiting or responding to the subject rather than replacing the subject",
        ],
    },
}


CATEGORY_POSE_MAP = {
    "taiwan_travel": "travel",
    "europe_travel": "travel",
    "japan_travel": "travel",
    "korea_sea": "travel",
    "world_travel": "travel",
    "china_mark": "travel",
    "mountain_sea": "travel",
    "wedding_diamond": "wedding",
    "hanfu": "hanfu",
    "dynasty_palace": "hanfu",
    "tang_grandeur": "hanfu",
    "song_grace": "hanfu",
    "ming_grace": "hanfu",
    "qing_grace": "hanfu",
    "xianxia": "hanfu",
    "oriental": "hanfu",
    "chinese_story": "hanfu",
    "classic_lit": "hanfu",
    "jinyong": "hanfu",
    "china_drama": "hanfu",
    "drama": "hanfu",
    "hotdrama": "hanfu",
    "queen": "queen",
    "succubus_demon": "queen",
    "fallen_angel": "queen",
    "holy_angel": "queen",
    "goddess_myth": "queen",
    "myth": "queen",
    "fantasy": "fantasy",
    "gothic": "fantasy",
    "darkfantasy": "fantasy",
    "water": "fantasy",
    "spirits": "fantasy",
    "dragon_beast": "fantasy",
    "beast_tamer": "fantasy",
    "cyberpunk_sf": "fantasy",
    "game": "fantasy",
    "cos_character": "fantasy",
    "modern_lady": "travel",
    "realistic_life": "travel",
}


def choose_variant(variants: list[str], seed: int) -> str:
    return variants[seed % len(variants)]


def find_matching_brace(text: str, open_index: int) -> int:
    depth = 0
    in_string = False
    escape = False
    quote_char = ""

    for i in range(open_index, len(text)):
        ch = text[i]
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == quote_char:
                in_string = False
            continue

        if ch in ("'", '"'):
            in_string = True
            quote_char = ch
            continue

        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i

    raise ValueError("matching brace not found")


def iter_entry_blocks(body: str):
    i = 0
    while True:
        start = body.find("{id:'", i)
        if start == -1:
            break
        end = find_matching_brace(body, start)
        trailing_end = end + 1
        while trailing_end < len(body) and body[trailing_end] in " \t":
            trailing_end += 1
        if trailing_end < len(body) and body[trailing_end] == ",":
            trailing_end += 1
        yield start, trailing_end, body[start:trailing_end]
        i = trailing_end


def insert_fields(entry_text: str, prop_text: str | None, comp_text: str | None) -> str:
    has_trailing_comma = entry_text.rstrip().endswith(",")
    core = entry_text.rstrip()
    if has_trailing_comma:
        core = core[:-1]

    entry_match = re.search(r"\{id:'[^']+'.*\}", core, re.S)
    if not entry_match:
        return entry_text

    entry_core = entry_match.group(0)
    compact = "\n" not in entry_core

    if compact:
        insert_parts = []
        if prop_text and "prop:'" not in entry_core:
            insert_parts.append(f" prop:'{prop_text}',")
        if comp_text and "comp:'" not in entry_core:
            insert_parts.append(f" comp:'{comp_text}',")
        rebuilt = entry_core[:-1] + "".join(insert_parts) + "}"
    else:
        lines = entry_core.splitlines()
        insert_at = len(lines)
        for i, line in enumerate(lines):
            if any(
                key in line
                for key in ["mk:'", "ratio:'", "lens:'", "ang:'", "camLang:'", "fx:'", "tone:'", "quality:'"]
            ):
                insert_at = i
                break

        additions = []
        indent = "     "
        if prop_text and "prop:'" not in entry_core:
            additions.append(f"{indent}prop:'{prop_text}',")
        if comp_text and "comp:'" not in entry_core:
            additions.append(f"{indent}comp:'{comp_text}',")
        if additions:
            lines[insert_at:insert_at] = additions
        rebuilt = "\n".join(lines)

    if has_trailing_comma:
        rebuilt += ","
    return rebuilt


def main() -> None:
    text = INDEX_PATH.read_text(encoding="utf-8")
    cat_pattern = re.compile(
        r"\{id:'(?P<id>[^']+)', name:'(?P<name>[^']+)', icon:'[^']+', tpl:'(?P<tpl>[^']+)', entries:\[(?P<body>.*?)\]\},",
        re.S,
    )

    new_text = text
    for cat in reversed(list(cat_pattern.finditer(text))):
        cat_id = cat.group("id")
        pose_group = CATEGORY_POSE_MAP.get(cat_id) or CATEGORY_POSE_MAP.get(cat.group("tpl"))
        if not pose_group:
            continue

        body = cat.group("body")
        updated_body = body
        entry_blocks = list(iter_entry_blocks(body))
        for seed, (start, end, entry_text) in enumerate(reversed(entry_blocks)):
            lib = CATEGORY_POSE_LIBRARY[pose_group]
            prop_text = None if "prop:'" in entry_text else choose_variant(lib["prop"], seed)
            comp_text = None if "comp:'" in entry_text else choose_variant(lib["comp"], seed)
            updated_entry = insert_fields(entry_text, prop_text, comp_text)
            updated_body = updated_body[:start] + updated_entry + updated_body[end:]

        new_cat = cat.group(0).replace(body, updated_body, 1)
        new_text = new_text[:cat.start()] + new_cat + new_text[cat.end():]

    INDEX_PATH.write_text(new_text, encoding="utf-8")
    print("hydrated pose and composition fields into index.html")


if __name__ == "__main__":
    main()
