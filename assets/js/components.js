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
    let leftSide = `
      <a href="${returnUrl}" class="flex items-center gap-4 group">
        <span class="material-symbols-outlined text-white/50 group-hover:text-white transition-all duration-300 transform group-hover:-translate-x-1">arrow_back</span>
        <span class="font-label text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">${returnText}</span>
      </a>
    `;

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
        <div class="flex justify-center items-center w-full max-w-screen-2xl mx-auto">
          <img src="${logoSrc}" alt="Parket" class="h-4 w-auto" />
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
customElements.define('parket-footer', ParketFooter);
customElements.define('parket-seo', ParketSEO);
customElements.define('parket-videos', ParketVideos);
