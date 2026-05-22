from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_PATHS = [
    ROOT / "index.html",
    ROOT / "core.js",
    ROOT / "docs",
    ROOT / "核心資料" / "核心咒語規範.md",
    ROOT / "核心資料" / "風格範例.md",
]


def main() -> int:
    missing = [path for path in REQUIRED_PATHS if not path.exists()]
    if missing:
        print("missing required paths:")
        for path in missing:
            print(f"- {path}")
        return 1

    print("structure check passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
