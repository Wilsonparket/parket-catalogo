import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html' and f != 'catalogo.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match the subtitle span block and add -ml-1 for optical alignment
    # Old: class="font-label uppercase tracking-[0.5em] text-[10px] text-white/30 mb-6 block"
    # New: class="font-label uppercase tracking-[0.5em] text-[10px] text-white/30 mb-6 block -ml-1"
    
    # We will use regex to find this specific span pattern to make sure we hit all variations (like 'Coleção Exclusiva')
    content = re.sub(
        r'(<span class="font-label uppercase tracking-\[0.5em\] text-\[10px\] text-white/30 mb-6 block)(">)',
        r'\1 -ml-1\2',
        content
    )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Alignment fixed.")
