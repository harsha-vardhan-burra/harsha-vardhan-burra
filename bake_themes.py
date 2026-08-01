import os, re, glob

SRC = "assets/icons"
DARK_FG, DARK_BG = "#E6EDF3", "#0d1117"
LIGHT_FG, LIGHT_BG = "#24292F", "#ffffff"

for path in glob.glob(f"{SRC}/*.svg"):
    name = os.path.basename(path)
    with open(path) as f:
        content = f.read()

    dark = content.replace("currentColor", DARK_FG).replace(
        'var(--icon-bg, #0d1117)', DARK_BG
    )
    light = content.replace("currentColor", LIGHT_FG).replace(
        'var(--icon-bg, #0d1117)', LIGHT_BG
    )

    with open(f"{SRC}/dark/{name}", "w") as f:
        f.write(dark)
    with open(f"{SRC}/light/{name}", "w") as f:
        f.write(light)

print(f"baked {len(glob.glob(f'{SRC}/*.svg'))} icons x 2 themes")
