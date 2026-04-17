import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html' and f != 'catalogo.html' and f != 'pisos-brazil.html' and f != 'pisos-eternos.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update subtitle span: replace -ml-1 with -ml-0
    content = re.sub(
        r'(<span class="font-label uppercase tracking-\[0.5em\] text-\[10px\] text-white/30 mb-6 block) -ml-1(">)',
        r'\1 -ml-0\2',
        content
    )

    # 2. Update h1 page-title: add -ml-[10px]
    # Match id="page-title" and class attribute, inserting -ml-[10px] at the end of the class content.
    # Note: We must ensure not to duplicate it if it already exists.
    def add_negative_margin(match):
        class_content = match.group(2)
        if '-ml-[10px]' not in class_content:
            class_content += ' -ml-[10px]'
        return f'{match.group(1)}{class_content}{match.group(3)}'

    content = re.sub(
        r'(<h1 id="page-title" class=")([^"]+)(">)',
        add_negative_margin,
        content
    )
    
    # Wait, some tags might have line breaks, so re.DOTALL or just regular if it's on the same line.
    # In earlier edits, they look strictly one-liner but just in case, we do an alternative sub:
    # Look for '<h1 id="page-title"' and replace up to the closing quote of class="..."
    def inject_h1_margin(full_content):
        # We find class="... " and add before the closing quote
        pattern = r'(<h1[^>]*id="page-title"[^>]*class=")([^"]+)(")'
        def inline_repl(m):
            cls = m.group(2)
            if '-ml-[10px]' not in cls:
                cls += ' -ml-[10px]'
            return f"{m.group(1)}{cls}{m.group(3)}"
        return re.sub(pattern, inline_repl, full_content)

    content = inject_h1_margin(content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Alignment fixed for {len(html_files)} files.")
