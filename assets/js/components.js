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
        <div class="flex flex-col md:flex-row justify-between items-center gap-12 w-full max-w-screen-2xl mx-auto">
          <div><img src="${logoSrc}" alt="Parket" class="h-4 w-auto" /></div>
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

// ── Global Lightbox Logic ──
window.addEventListener('DOMContentLoaded', () => {
  // Inject zoom-in cursor style for all carousels
  const style = document.createElement('style');
  style.innerHTML = `
    .carousel-slide { cursor: zoom-in !important; }
  `;
  document.head.appendChild(style);

  // Inject DOM element safely
  const lbContainer = document.createElement('div');
  lbContainer.innerHTML = `
    <div id="parket-global-lightbox" class="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl hidden items-center justify-center transition-all duration-500 opacity-0 cursor-zoom-out" style="display: none;">
      <img id="parket-lightbox-img" class="max-w-[95vw] max-h-[95vh] object-contain transform scale-90 transition-transform duration-700 select-none shadow-2xl" src="" alt="View" />
    </div>
  `;
  document.body.appendChild(lbContainer);

  const lb = document.getElementById('parket-global-lightbox');
  const img = document.getElementById('parket-lightbox-img');
  
  lb.addEventListener('click', () => {
    lb.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lb.style.display = 'none';
    }, 500);
  });

  window.openParketLightbox = (src) => {
    img.src = src;
    lb.style.display = 'flex';
    // Trigger paint reflow for animation
    void lb.offsetWidth;
    lb.style.opacity = '1';
    img.style.transform = 'scale(1)';
  };
  
  // Attach delegated click listener to trigger zoom without modifying separate HTML files
  document.body.addEventListener('click', (e) => {
    const slide = e.target.closest('.carousel-slide');
    // We only want to zoom the ACTIVE slide, so arrows/background don't accidentally trigger it. 
    // And actually, if you click the arrows, e.target is .material-symbols-outlined which is inside .carousel-arrow.
    const isArrow = e.target.closest('.carousel-arrow');
    if (slide && !isArrow) {
      const imgTarget = slide.querySelector('img');
      if (imgTarget && imgTarget.src) window.openParketLightbox(imgTarget.src);
    }
  });

  // Close with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.style.display === 'flex') {
      lb.click();
    }
  });
});

// Register components
customElements.define('parket-loader', ParketLoader);
customElements.define('parket-nav', ParketNav);
customElements.define('parket-footer', ParketFooter);
customElements.define('parket-seo', ParketSEO);
