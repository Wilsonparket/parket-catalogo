import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html' and f != 'catalogo.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'components.js' not in content:
        # Determine category
        category = ''
        title_search = re.search(r'<title>Parket - (.*?)</title>', content)
        if title_search:
            category = title_search.group(1)
            
        head_injectionHTML = f'  <script src="assets/js/components.js"></script>\n  <parket-seo title="Parket {category}"></parket-seo>\n</head>'
        content = content.replace('</head>', head_injectionHTML)

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file}")

