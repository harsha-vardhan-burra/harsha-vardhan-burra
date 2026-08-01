"""
Bake dark/light variants.

Every icon now carries its own fixed brand color (no more currentColor
token) — see generate_icons_colored.py for the 7 hand-built icons and
scripts/build-icons.mjs for the 9 official ones. vscode.svg is untouched
brand-fixed art either way.

Most icons look fine on both a near-black and a near-white background, so
light/ and dark/ are identical copies by default. A short list of colors
are too dark to read on this README's #0d1117 background, so those get a
lighter override specifically in the dark/ copy.
"""
import os, glob, shutil

SRC = "assets/icons"
os.makedirs(f"{SRC}/dark", exist_ok=True)
os.makedirs(f"{SRC}/light", exist_ok=True)

# slug -> (original hex to find, lighter hex to use in dark/ only)
DARK_OVERRIDES = {
    "github":   ("#181717", "#C9D1D9"),
    "codechef": ("#5B4638", "#A78874"),
    "sqlite":   ("#003B57", "#4FA8D8"),
    "java":     ("#000000", "#D9D9D9"),
}

count = 0
for path in glob.glob(f"{SRC}/*.svg"):
    name = os.path.basename(path)
    slug = name[:-4]
    with open(path) as f:
        content = f.read()

    shutil.copy(path, f"{SRC}/light/{name}")

    if slug in DARK_OVERRIDES:
        old, new = DARK_OVERRIDES[slug]
        dark_content = content.replace(old, new)
    else:
        dark_content = content

    with open(f"{SRC}/dark/{name}", "w") as f:
        f.write(dark_content)

    count += 1

print(f"baked {count} icons x 2 themes  ({len(DARK_OVERRIDES)} with dark-mode overrides)")
