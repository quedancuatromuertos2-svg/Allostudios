(function () {
  var id = document.currentScript && document.currentScript.getAttribute('data-business-id');
  if (!id) { console.warn('[AlloStudios] Missing data-business-id attribute'); return; }

  var ACCENT = '#5B5BD6';
  var open = false;
  var iframe, btn, badge;

  // Button
  btn = document.createElement('button');
  btn.id = 'allostudios-btn';
  btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  Object.assign(btn.style, {
    position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
    borderRadius: '50%', background: ACCENT, border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(91,91,214,0.4)', zIndex: '999998',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  });

  // Pulse ring
  var pulse = document.createElement('div');
  Object.assign(pulse.style, {
    position: 'fixed', bottom: '16px', right: '16px', width: '72px', height: '72px',
    borderRadius: '50%', background: ACCENT, opacity: '0.25', zIndex: '999997',
    animation: 'allostudios-pulse 2s ease-out infinite',
    pointerEvents: 'none',
  });

  var style = document.createElement('style');
  style.textContent = '@keyframes allostudios-pulse { 0% { transform: scale(1); opacity: 0.25; } 100% { transform: scale(1.6); opacity: 0; } }';
  document.head.appendChild(style);

  // Iframe container
  var container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed', bottom: '92px', right: '24px', width: '360px', height: '540px',
    borderRadius: '16px', overflow: 'hidden', zIndex: '999999',
    boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'none',
    transition: 'opacity 0.2s, transform 0.2s', opacity: '0', transform: 'scale(0.95)',
    transformOrigin: 'bottom right',
  });

  iframe = document.createElement('iframe');
  iframe.src = 'https://allostudios.net/widget/' + id;
  Object.assign(iframe.style, { width: '100%', height: '100%', border: 'none' });
  container.appendChild(iframe);

  btn.addEventListener('mouseenter', function () {
    btn.style.transform = 'scale(1.1)';
    btn.style.boxShadow = '0 6px 24px rgba(91,91,214,0.5)';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 4px 20px rgba(91,91,214,0.4)';
  });

  btn.addEventListener('click', function () {
    open = !open;
    if (open) {
      container.style.display = 'block';
      pulse.style.display = 'none';
      setTimeout(function () {
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
      }, 10);
      btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      container.style.opacity = '0';
      container.style.transform = 'scale(0.95)';
      pulse.style.display = 'block';
      setTimeout(function () { container.style.display = 'none'; }, 200);
      btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    }
  });

  document.body.appendChild(pulse);
  document.body.appendChild(container);
  document.body.appendChild(btn);

  // Mobile responsive
  if (window.innerWidth < 480) {
    Object.assign(container.style, { width: 'calc(100vw - 24px)', right: '12px', bottom: '80px' });
  }
})();
