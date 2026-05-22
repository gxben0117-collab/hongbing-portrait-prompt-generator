from pathlib import Path
import json
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "index.html"


def extract_cats_array(text: str) -> str:
    marker = "const CATS = ["
    start = text.find(marker)
    if start == -1:
        raise ValueError("CATS declaration not found")

    open_index = text.find("[", start)
    depth = 0
    in_string = False
    quote_char = ""
    escape = False

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

        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return text[open_index : i + 1]

    raise ValueError("CATS closing bracket not found")


def load_cats() -> list[dict]:
    text = INDEX_PATH.read_text(encoding="utf-8")
    array_text = extract_cats_array(text)

    if re.search(r"^\s*\[", array_text) and '"' in array_text:
        try:
            return json.loads(array_text)
        except json.JSONDecodeError:
            pass

    command = [
        "node",
        "-e",
        (
            "const vm=require('vm');"
            "const input=process.argv[1];"
            "const parsed=vm.runInNewContext('('+input+')');"
            "process.stdout.write(JSON.stringify(parsed));"
        ),
        array_text,
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


def main() -> None:
    cats = load_cats()
    found_gap = False

    for cat in cats:
        entries = cat.get("entries", [])
        missing_prop = sum(1 for entry in entries if not entry.get("prop"))
        missing_comp = sum(1 for entry in entries if not entry.get("comp"))
        if missing_prop or missing_comp:
            found_gap = True
            print(
                f"{cat.get('id')} | {cat.get('name')} | total={len(entries)} | "
                f"missing_prop={missing_prop} | missing_comp={missing_comp}"
            )

    if not found_gap:
        print("No missing prop/comp fields found.")


if __name__ == "__main__":
    main()
