from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


def main() -> None:
    DIST.mkdir(exist_ok=True)
    for filename in ("index.html", "core.js"):
        src = ROOT / filename
        dst = DIST / filename
        if src.exists():
            shutil.copy2(src, dst)
            print(f"copied: {src.name} -> dist/{src.name}")
        else:
            print(f"missing: {src}")


if __name__ == "__main__":
    main()
