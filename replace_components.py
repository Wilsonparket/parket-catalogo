import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine default attributes based on filename logic
    return_url = 'catalogo.html'
    return_text = 'Voltar ao Catálogo'
    category = ''
    
    if file.startswith('pisos-'):
        return_url = 'pisos.html'
        return_text = 'Voltar aos Pisos'
        title_search = re.search(r'<title>Parket - (.*?)</title>', content)
        if title_search:
            category = title_search.group(1)
            
    is_main = " is-main" if file == 'catalogo.html' else ""

    # 1. Replace Nav
    nav_pattern = re.compile(r'<nav[^>]*>.*?</nav>', re.DOTALL)
    nav_replacement = f'<parket-nav return-url="{return_url}" return-text="{return_text}" category="{category}"{is_main}></parket-nav>'
    content = nav_pattern.sub(nav_replacement, content)

    # 2. Replace Footer
    footer_pattern = re.compile(r'<footer[^>]*>.*?</footer>', re.DOTALL)
    footer_replacement = '<parket-footer></parket-footer>'
    content = footer_pattern.sub(footer_replacement, content)
    
    # 3. Add Loader right after <body>
    if '<parket-loader>' not in content:
        content = re.sub(r'(<body[^>]*>)', r'\1\n  <parket-loader></parket-loader>', content)
        
    # 4. Add Script and SEO into head if not exists 
    if 'components.js' not in content:
        head_injectionHTML = f'<script src="assets/js/components.js"></script>\n  <parket-seo title="Parket {category}"></parket-seo>'
        # Insert before the closing head tag, or before the tailwind script to prevent breaking anything
        content = re.sub(r'(<script[^>]*tailwind\.config)', head_injectionHTML + r'\n  \1', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} files.")
