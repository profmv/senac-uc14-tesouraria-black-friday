(() => {
  const key = 'tesouraria-theme';
  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  function apply(theme) {
    root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    const label = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
    toggles.forEach(button => {
      const caption = button.querySelector('[data-theme-label]') || button;
      caption.textContent = label;
      button.setAttribute('aria-label', 'Ativar ' + label.toLowerCase());
    });
  }
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Use the default theme. */ }
  apply(saved);
  toggles.forEach(button => button.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(theme);
    try { localStorage.setItem(key, theme); } catch { /* The current page still updates. */ }
  }));
  window.addEventListener('storage', event => { if (event.key === key) apply(event.newValue); });
  const links = Array.from(document.querySelectorAll('.hub-nav a'));
  if (links.length) {
    function selectSection() {
      const active = links.filter(link => document.querySelector(link.hash).getBoundingClientRect().top <= 100).pop() || links[0];
      links.forEach(link => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', selectSection, {passive: true});
    selectSection();
  }
})();
