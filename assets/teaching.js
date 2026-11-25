(() => {
  const boxes = [...document.querySelectorAll('[data-progress]')];
  const output = document.querySelector('[data-progress-count]');
  const key = 'uc14-guia-progress-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { saved = {}; }
  const update = () => {
    if (output) output.textContent = `${boxes.filter(box => box.checked).length} de ${boxes.length} blocos concluídos`;
  };
  boxes.forEach(box => {
    box.checked = Boolean(saved[box.dataset.progress]);
    box.addEventListener('change', () => {
      saved[box.dataset.progress] = box.checked;
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch (_) { /* Progress remains available for this session. */ }
      update();
    });
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
  update();
})();
