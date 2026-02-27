// Persist expanded state of life update <details>
document.addEventListener('DOMContentLoaded', () => {
  const details = document.querySelectorAll('section.life-updates details');
  if (!details.length) return;
  details.forEach((d, i) => {
    const key = `life-update:${i}`;
    const saved = localStorage.getItem(key);
    if (saved === 'open') {
      d.open = true;
    } else if (saved === null && i === 0) {
      d.open = true;
    }
    d.addEventListener('toggle', () => {
      localStorage.setItem(key, d.open ? 'open' : 'closed');
    });
  });

  let activeTag = 'all';
  let showAll = false;
  const toggleBtn = document.querySelector('section.life-updates [data-action="toggle-updates"]');
  const initialVisibleCount = 2;

  const applyUpdateVisibility = () => {
    const visible = [];
    details.forEach((d) => {
      const tags = (d.getAttribute('data-tags') || '').split(',').map(s => s.trim()).filter(Boolean);
      const matches = activeTag === 'all' ? true : tags.includes(activeTag);
      d.style.display = matches ? '' : 'none';
      if (matches) visible.push(d);
    });

    if (!toggleBtn) return;

    const toggleRelevant = activeTag === 'all' && visible.length > initialVisibleCount;
    toggleBtn.style.display = toggleRelevant ? '' : 'none';

    if (!toggleRelevant) return;

    visible.forEach((d, i) => {
      d.style.display = showAll || i < initialVisibleCount ? '' : 'none';
    });

    toggleBtn.textContent = showAll ? 'Show fewer updates' : 'Show all updates';
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      showAll = !showAll;
      applyUpdateVisibility();
    });
  }

  // Tag filtering for updates
  const filters = document.querySelector('.life-updates .filters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const tag = btn.getAttribute('data-filter');
      activeTag = tag;
      if (activeTag !== 'all') showAll = true;

      // toggle active visual state
      filters.querySelectorAll('.tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      applyUpdateVisibility();
    });
  }

  applyUpdateVisibility();

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
