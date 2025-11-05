// Persist expanded state of life update <details>
document.addEventListener('DOMContentLoaded', () => {
  const details = document.querySelectorAll('section.life-updates details');
  details.forEach((d, i) => {
    const key = `life-update:${i}`;
    const saved = localStorage.getItem(key);
    if (saved === 'open') d.open = true;
    d.addEventListener('toggle', () => {
      localStorage.setItem(key, d.open ? 'open' : 'closed');
    });
  });

  // Tag filtering for updates
  const filters = document.querySelector('.life-updates .filters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const tag = btn.getAttribute('data-filter');

      // toggle active visual state
      filters.querySelectorAll('.tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('section.life-updates details').forEach(d => {
        if (tag === 'all') {
          d.style.display = '';
          return;
        }
        const tags = (d.getAttribute('data-tags') || '').split(',').map(s => s.trim());
        d.style.display = tags.includes(tag) ? '' : 'none';
      });
    });
  }

  // Wave animation: wrap title text in spans with staggered delays
  const title = document.querySelector('.wave-title');
  if (title && !title.dataset.waveEnhanced) {
    const text = title.textContent;
    const frag = document.createDocumentFragment();
    let idx = 0;
    for (const ch of Array.from(text)) {
      if (ch.trim() === '') {
        frag.appendChild(document.createTextNode(ch));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'wave-char';
      span.textContent = ch;
      span.style.setProperty('--i', idx.toString());
      frag.appendChild(span);
      idx++;
    }
    title.textContent = '';
    title.appendChild(frag);
    title.dataset.waveEnhanced = 'true';
  }
});
