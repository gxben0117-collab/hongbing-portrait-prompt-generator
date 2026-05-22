from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "index.html"


def main() -> None:
    text = INDEX_PATH.read_text(encoding="utf-8")
    cat_pattern = re.compile(
        r"\{id:'(?P<id>[^']+)', name:'(?P<name>[^']+)', icon:'[^']+', tpl:'(?P<tpl>[^']+)', entries:\[(?P<body>.*?)\]\},",
        re.S,
    )
    entry_pattern = re.compile(r"\{id:'(?P<eid>[^']+)'(?P<body>.*?)\}", re.S)

    for cat in cat_pattern.finditer(text):
        body = cat.group("body")
        entries = list(entry_pattern.finditer(body))
        missing_prop = 0
        missing_comp = 0
        for entry in entries:
            entry_body = entry.group("body")
            if "prop:'" not in entry_body:
                missing_prop += 1
            if "comp:'" not in entry_body:
                missing_comp += 1
        if missing_prop or missing_comp:
            print(
                f"{cat.group('id')} | {cat.group('name')} | total={len(entries)} | "
                f"missing_prop={missing_prop} | missing_comp={missing_comp}"
            )


if __name__ == "__main__":
    main()
