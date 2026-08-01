import os

OUT = "assets/icons"

WRAPPER = '''<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{label}" class="icon icon-{slug}">
  <title>{label}</title>
  <desc>{desc}</desc>
{body}
</svg>
'''

def write(slug, label, desc, body):
    svg = WRAPPER.format(label=label, desc=desc, body=body, slug=slug)
    with open(f"{OUT}/{slug}.svg", "w") as f:
        f.write(svg)
    print(f"wrote {slug}.svg")

LINE = 'fill="none" stroke="{c}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'

write("git", "Git", "Git version control branch icon", f'''  <g {LINE.format(c="#F05033")}>
    <circle cx="9" cy="8" r="2.3"/><circle cx="9" cy="24" r="2.3"/><circle cx="23" cy="16" r="2.3"/>
    <path d="M9 10.3V21.7"/><path d="M9 14c0 3.5 3 5 6.5 5H20.7"/>
  </g>''')

write("bash", "Bash / Terminal", "Terminal prompt icon", f'''  <g {LINE.format(c="#4EAA25")}>
    <rect x="5" y="6" width="22" height="20" rx="3"/>
    <path d="M10 13l4.5 4.5L10 22"/><path d="M17 22h6"/>
  </g>''')

write("email", "Email", "Envelope icon", f'''  <g {LINE.format(c="#EA4335")}>
    <rect x="5" y="8" width="22" height="16" rx="2.5"/>
    <path d="M6 9.5l10 8.5 10-8.5"/>
  </g>''')

write("vite", "Vite", "Lightning bolt icon representing the Vite build tool",
      '''  <path d="M18.5 4L7 18.5h7l-1.5 9.5L26 13h-7.5z" fill="#646CFF"/>''')

write("react", "React", "React atom logo — nucleus with three orbiting ellipses", f'''  <g {LINE.format(c="#61DAFB")}>
    <circle cx="16" cy="16" r="2.1" fill="#61DAFB" stroke="none"/>
    <ellipse cx="16" cy="16" rx="11" ry="4.3"/>
    <ellipse cx="16" cy="16" rx="11" ry="4.3" transform="rotate(60 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="4.3" transform="rotate(120 16 16)"/>
  </g>''')

write("javascript", "JavaScript", "JS lettermark badge", '''  <g>
    <rect x="5" y="5" width="22" height="22" rx="4" fill="#F7DF1E"/>
    <text x="16" y="21.5" font-family="Fira Code, Menlo, monospace" font-size="11" font-weight="700"
          text-anchor="middle" fill="#1A1A1A">JS</text>
  </g>''')

write("linkedin", "LinkedIn", "LinkedIn 'in' lettermark badge", '''  <g>
    <rect x="5" y="5" width="22" height="22" rx="4" fill="#0A66C2"/>
    <circle cx="11.2" cy="11.5" r="1.7" fill="#ffffff"/>
    <rect x="9.7" y="14.5" width="3" height="9" fill="#ffffff"/>
    <path d="M15.5 23.5v-9h3v1.4c.8-1.1 2-1.7 3.4-1.7 2.5 0 4.1 1.7 4.1 4.6v4.7h-3v-4.2c0-1.4-.6-2.3-1.9-2.3-1 0-1.7.7-2 1.4-.1.3-.1.6-.1 1v4.1h-3z" fill="#ffffff"/>
  </g>''')

print("done")
