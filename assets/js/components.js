class ParketLoader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="parket-global-loader" style="position: fixed; inset: 0; background: #000; z-index: 10000; display: flex; align-items: center; justify-content: center; transition: opacity 1s cubic-bezier(0.76, 0, 0.24, 1); pointer-events: none;">
        <h1 style="font-family: 'Inter', sans-serif; font-size: 1.5rem; letter-spacing: 0.5em; text-transform: uppercase; color: #fff; font-weight: 200; animation: pulse 2s infinite ease-in-out;">
          Parket
        </h1>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1); }
        }
      </style>
    `;
    
    window.addEventListener('load', () => {
      const loader = document.getElementById('parket-global-loader');
      if (loader) {
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 1000);
        }, 500); // 500ms delay to ensure heavy scripts and images have started downloading visually
      }
    });
  }
}

class ParketNav extends HTMLElement {
  connectedCallback() {
    const returnUrl = this.getAttribute('return-url') || 'catalogo.html';
    const returnText = this.getAttribute('return-text') || 'Voltar';
    const category = this.getAttribute('category') || '';
    
    // Most subpages need the arrow back icon. The main catalogo.html might use this differently.
    const isMain = this.hasAttribute('is-main');

    let leftSide = '';
    if (!isMain) {
      leftSide = `
        <a href="${returnUrl}" class="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-500 group">
          <span class="material-symbols-outlined text-white/60 group-hover:text-white text-[16px] transition-transform duration-500 group-hover:-translate-x-1">arrow_back</span>
          <span class="font-label text-[10px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">${returnText}</span>
        </a>
      `;
    } else {
      leftSide = `
        <div><img src="logo-parket.png" alt="Parket" class="h-4 w-auto opacity-80" /></div>
      `;
    }

    this.innerHTML = `
      <nav class="fixed top-0 w-full z-50 nav-blur border-b border-white/5">
        <div class="flex justify-between items-center w-full px-12 py-6 max-w-screen-2xl mx-auto">
          ${leftSide}
          ${category ? `<span class="font-label text-[10px] uppercase tracking-[0.3em] text-white/30 truncate max-w-[200px] text-right">${category}</span>` : ''}
        </div>
      </nav>
      <style>
        .nav-blur {
          background: rgba(0,0,0,0.6);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        }
      </style>
    `;
  }
}

class ParketFooter extends HTMLElement {
  connectedCallback() {
    // Check if we are in a subfolder or root to resolve the logo image
    const depth = this.getAttribute('depth') || '0';
    const logoSrc = depth === '1' ? '../logo-parket.png' : 'logo-parket.png';

    this.innerHTML = `
      <footer class="w-full py-24 px-12 bg-black border-t border-white/5 relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-12 w-full max-w-screen-2xl mx-auto">
          <div><img src="${logoSrc}" alt="Parket" class="h-4 w-auto" /></div>
          <div class="flex gap-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <a href="#" class="font-label text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">Instagram</a>
            <a href="#" class="font-label text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">LinkedIn</a>
            <a href="#" class="font-label text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">Pinterest</a>
          </div>
          <div class="text-white/30 font-label text-[10px] uppercase tracking-[0.2em] font-light text-center">
            &copy; ${new Date().getFullYear()} PARKET. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    `;
  }
}

class ParketSEO extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Parket Catálogo';
    const description = this.getAttribute('description') || 'A evolução do design em madeira. Descubra nossas coleções exclusivas de pisos, decks, painéis, forros e escadas com design e engenharia de ponta.';
    const image = this.getAttribute('image') || 'https://parket.com.br/wp-content/uploads/2025/10/PRO_FO-01.jpg';
    
    // Inject metadata into <head>
    const metaTags = `
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      
      <!-- Twitter / X -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:title" content="${title}">
      <meta property="twitter:description" content="${description}">
      <meta property="twitter:image" content="${image}">
    `;
    
    document.head.insertAdjacentHTML('beforeend', metaTags);
  }
}

// Register components
customElements.define('parket-loader', ParketLoader);
customElements.define('parket-nav', ParketNav);
customElements.define('parket-footer', ParketFooter);
customElements.define('parket-seo', ParketSEO);
