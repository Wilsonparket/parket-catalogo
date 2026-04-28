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

const PARKET_PAGES = [
  { cat: 'Catálogo', name: 'Catálogo', url: 'catalogo.html' },
  { cat: 'Decks', name: 'Decks', url: 'decks.html' },
  { cat: 'Decks', name: 'Brazil', url: 'decks-brazil.html' },
  { cat: 'Decks', name: 'EuroDeck', url: 'decks-eurodeck.html' },
  { cat: 'Decks', name: 'Kebony', url: 'decks-kebony.html' },
  { cat: 'Decks', name: 'Únicos', url: 'decks-unicos.html' },
  { cat: 'Escadas', name: 'Escadas', url: 'escadas.html' },
  { cat: 'Fachadas', name: 'Fachadas', url: 'fachadas.html' },
  { cat: 'Forros', name: 'Forros', url: 'forros.html' },
  { cat: 'Painéis', name: 'Painéis', url: 'paineis.html' },
  { cat: 'Pisos', name: 'Pisos', url: 'pisos.html' },
  { cat: 'Pisos', name: 'Brazil', url: 'pisos-brazil.html' },
  { cat: 'Pisos', name: 'Carvalhos', url: 'pisos-carvalhos.html' },
  { cat: 'Pisos', name: 'Clássicos', url: 'pisos-classicos.html' },
  { cat: 'Pisos', name: 'Eternos', url: 'pisos-eternos.html' },
  { cat: 'Pisos', name: 'Grandiosos', url: 'pisos-grandiosos.html' },
  { cat: 'Pisos', name: 'Listone Giordano', url: 'pisos-listone-giordano.html' },
  { cat: 'Pisos', name: 'Pinho de Riga', url: 'pisos-pinho-de-riga.html' },
  { cat: 'Pisos', name: 'Únicos', url: 'pisos-unicos.html' },
  { cat: 'Portas', name: 'Portas', url: 'portas.html' },
  { cat: 'Texturas', name: 'Texturas', url: 'texturas.html' },
  { cat: 'Texturas › Pisos', name: 'Visão geral', url: 'texturas-pisos.html' },
  { cat: 'Texturas › Pisos', name: 'Chevron Naturalle', url: 'texturas-pisos-chevron-naturalle.html' },
  { cat: 'Texturas › Pisos', name: 'Espinha de Peixe Mont Blanc', url: 'texturas-pisos-espinha-de-peixe-mont-blanc.html' },
  { cat: 'Texturas › Pisos', name: 'Piso Verssailes', url: 'texturas-pisos-piso-verssailes.html' },
  { cat: 'Texturas › Pisos', name: 'Reta', url: 'texturas-pisos-reta.html' },
];

function parketNormalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

class ParketNav extends HTMLElement {
  connectedCallback() {
    const returnUrl = this.getAttribute('return-url') || 'catalogo.html';
    const returnText = this.getAttribute('return-text') || 'Voltar';
    const category = this.getAttribute('category') || '';

    this.innerHTML = `
      <nav class="fixed top-0 w-full z-50 nav-blur border-b border-white/5">
        <div class="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 max-w-screen-2xl mx-auto gap-4">
          <a href="${returnUrl}" class="flex items-center gap-3 md:gap-4 group min-w-0">
            <span class="material-symbols-outlined text-white/50 group-hover:text-white transition-all duration-300 transform group-hover:-translate-x-1">arrow_back</span>
            <span class="font-label text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors hidden sm:inline truncate">${returnText}</span>
          </a>
          <div class="flex items-center gap-3 md:gap-5 min-w-0">
            ${category ? `<span class="font-label text-[10px] uppercase tracking-[0.3em] text-white/30 truncate max-w-[160px] md:max-w-[240px] text-right hidden sm:inline">${category}</span>` : ''}
            <button type="button" class="parket-search-btn" aria-label="Buscar" data-action="open-search">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </nav>
      <div class="parket-search-overlay" data-action="search-overlay" aria-hidden="true">
        <div class="parket-search-panel">
          <div class="parket-search-input-wrap">
            <span class="material-symbols-outlined parket-search-icon">search</span>
            <input type="text" class="parket-search-input" placeholder="Buscar produto, coleção, categoria..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
            <button type="button" class="parket-search-close" data-action="close-search" aria-label="Fechar">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="parket-search-results" data-results></div>
        </div>
      </div>
      <style>
        .nav-blur {
          background: rgba(0,0,0,0.6);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        }
        .parket-search-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .parket-search-btn:hover { background: rgba(255,255,255,0.10); color: #fff; border-color: rgba(255,255,255,0.25); }
        .parket-search-btn .material-symbols-outlined { font-size: 18px; }

        .parket-search-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,0.85);
          backdrop-filter: saturate(180%) blur(28px);
          -webkit-backdrop-filter: saturate(180%) blur(28px);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 14vh 24px 40px;
          overflow-y: auto;
        }
        .parket-search-overlay.is-open { opacity: 1; visibility: visible; }

        .parket-search-panel {
          width: 100%;
          max-width: 720px;
          transform: translateY(-12px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .parket-search-overlay.is-open .parket-search-panel { transform: translateY(0); }

        .parket-search-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 9999px;
          background: rgba(255,255,255,0.04);
        }
        .parket-search-icon { color: rgba(255,255,255,0.5); font-size: 22px; }
        .parket-search-input {
          flex: 1;
          background: transparent;
          border: 0;
          outline: 0;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 0.02em;
        }
        .parket-search-input::placeholder { color: rgba(255,255,255,0.35); }
        .parket-search-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          border: 0;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .parket-search-close:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .parket-search-close .material-symbols-outlined { font-size: 18px; }

        .parket-search-results {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
        }
        .parket-search-result {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.2s ease, color 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .parket-search-result:hover,
        .parket-search-result:focus { background: rgba(255,255,255,0.05); color: #fff; outline: 0; }
        .parket-search-result-name {
          font-size: 15px;
          font-weight: 300;
          letter-spacing: 0.01em;
        }
        .parket-search-result-cat {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
        }
        .parket-search-empty {
          padding: 24px 18px;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.02em;
        }
        body.parket-search-locked { overflow: hidden; }
      </style>
    `;

    this._overlay = this.querySelector('[data-action="search-overlay"]');
    this._input   = this.querySelector('.parket-search-input');
    this._results = this.querySelector('[data-results]');

    this.querySelector('[data-action="open-search"]').addEventListener('click', () => this._openSearch());
    this.querySelector('[data-action="close-search"]').addEventListener('click', () => this._closeSearch());
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) this._closeSearch();
    });
    this._input.addEventListener('input', (e) => this._renderResults(e.target.value));
    this._input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeSearch();
      if (e.key === 'Enter') {
        const first = this._results.querySelector('.parket-search-result');
        if (first) window.location.href = first.getAttribute('href');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !this._isOpen() && !/^(input|textarea)$/i.test((document.activeElement || {}).tagName || '')) {
        e.preventDefault();
        this._openSearch();
      }
    });

    this._renderResults('');
  }

  _isOpen() { return this._overlay.classList.contains('is-open'); }

  _openSearch() {
    this._overlay.classList.add('is-open');
    this._overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('parket-search-locked');
    setTimeout(() => this._input.focus(), 50);
  }

  _closeSearch() {
    this._overlay.classList.remove('is-open');
    this._overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('parket-search-locked');
    this._input.value = '';
    this._renderResults('');
  }

  _renderResults(query) {
    const q = parketNormalize(query.trim());
    const list = q
      ? PARKET_PAGES.filter(p => parketNormalize(p.name + ' ' + p.cat).includes(q))
      : PARKET_PAGES;

    if (!list.length) {
      this._results.innerHTML = `<div class="parket-search-empty">Nenhum resultado para "${query}".</div>`;
      return;
    }

    this._results.innerHTML = list.map(p => `
      <a class="parket-search-result" href="${p.url}">
        <span class="parket-search-result-name">${p.name}</span>
        <span class="parket-search-result-cat">${p.cat}</span>
      </a>
    `).join('');
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

// ── Global Lightbox Logic (Vanilla CSS) ──
window.addEventListener('load', () => {
  const lbContainer = document.createElement('div');
  lbContainer.innerHTML = `
    <style>
      .carousel-slide { cursor: zoom-in !important; cursor: -webkit-zoom-in !important; }
      #parket-lb-overlay {
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(0,0,0,0.95);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; visibility: hidden;
        transition: opacity 0.4s ease, visibility 0.4s ease;
      }
      #parket-lb-overlay.lb-active { opacity: 1; visibility: visible; }
      #parket-lb-img {
        max-width: 95vw; max-height: 95vh; object-fit: contain;
        transform: scale(0.9);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); user-select: none;
        cursor: zoom-in; cursor: -webkit-zoom-in;
        transform-origin: center center;
      }
      #parket-lb-overlay.lb-active #parket-lb-img { transform: scale(1); }
      #parket-lb-overlay.lb-active #parket-lb-img.extreme-zoom {
        transform: scale(2.5);
        cursor: zoom-out; cursor: -webkit-zoom-out;
      }
    </style>
    <div id="parket-lb-overlay">
      <img id="parket-lb-img" src="" alt="Zoom detalhe">
    </div>
  `;
  document.body.appendChild(lbContainer);

  const lb = document.getElementById('parket-lb-overlay');
  const img = document.getElementById('parket-lb-img');
  let isZoomed = false;

  function panImage(e) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }

  img.addEventListener('click', (e) => {
    e.stopPropagation();
    isZoomed = !isZoomed;
    if (isZoomed) {
      img.classList.add('extreme-zoom');
      panImage(e);
    } else {
      img.classList.remove('extreme-zoom');
      // Reset after transition or immediately
      setTimeout(() => { if (!isZoomed) img.style.transformOrigin = 'center center'; }, 400);
    }
  });

  lb.addEventListener('mousemove', (e) => {
    if (isZoomed) panImage(e);
  });
  
  lb.addEventListener('click', () => { 
    lb.classList.remove('lb-active'); 
    isZoomed = false;
    img.classList.remove('extreme-zoom');
    img.style.transformOrigin = 'center center';
  });

  window.openParketLightbox = (src) => {
    img.src = src;
    requestAnimationFrame(() => lb.classList.add('lb-active'));
  };
  
  document.body.addEventListener('click', (e) => {
    const slide = e.target.closest('.carousel-slide');
    const arrow = e.target.closest('.carousel-arrow');
    
    if (slide && !arrow) {
      e.stopPropagation();
      const slideImg = slide.querySelector('img');
      if (slideImg && slideImg.src) window.openParketLightbox(slideImg.src);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('lb-active')) {
      lb.click();
    }
  });
});

class ParketVideos extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="max-w-screen-2xl mx-auto px-12 pb-40 fade-up" style="transition-delay: 0.3s">
        <div class="mb-12">
          <span class="font-label uppercase tracking-[0.5em] text-[10px] text-white/30 mb-6 block">Audiovisual</span>
          <h2 class="text-4xl font-extralight tracking-tight">Vídeos</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group cursor-pointer overflow-hidden relative">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
            <span class="material-symbols-outlined text-4xl text-white/50 group-hover:text-white transition-all scale-90 group-hover:scale-100">play_circle</span>
            <p class="absolute bottom-6 left-6 font-label text-[10px] uppercase tracking-widest text-white/60">Apresentação da Coleção</p>
          </div>
          <div class="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group cursor-pointer overflow-hidden relative">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
            <span class="material-symbols-outlined text-4xl text-white/50 group-hover:text-white transition-all scale-90 group-hover:scale-100">play_circle</span>
            <p class="absolute bottom-6 left-6 font-label text-[10px] uppercase tracking-widest text-white/60">Detalhes de Execução</p>
          </div>
        </div>
      </section>
    `;
  }
}

// Register components
customElements.define('parket-loader', ParketLoader);
customElements.define('parket-nav', ParketNav);
customElements.define('parket-seo', ParketSEO);
customElements.define('parket-videos', ParketVideos);
