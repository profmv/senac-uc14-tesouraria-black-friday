(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const count = document.querySelector('#slide-count');
  const progress = document.querySelector('#progress-bar');
  const timer = document.querySelector('#timer');
  const notes = document.querySelector('#notes-dialog');
  const score = document.querySelector('#score-dialog');
  let current = 0;
  let chart;

  function showSlide(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    count.textContent = `${current + 1} / ${slides.length}`;
    progress.style.width = `${(current + 1) / slides.length * 100}%`;
    document.querySelector('#previous').disabled = current === 0;
    document.querySelector('#next').disabled = current === slides.length - 1;
    timer.hidden = !slides[current].classList.contains('round');
    document.querySelector('#notes-content').textContent = slides[current].dataset.notes;
    window.scrollTo({top: 0, behavior: 'auto'});
  }
  document.querySelector('#previous').addEventListener('click', () => showSlide(current - 1));
  document.querySelector('#next').addEventListener('click', () => showSlide(current + 1));
  function toggleReveal() {
    const button = slides[current].querySelector('.reveal-button');
    if (button) button.click();
  }
  document.querySelectorAll('.reveal-button').forEach(button => button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    answer.hidden = !answer.hidden;
    button.setAttribute('aria-expanded', String(!answer.hidden));
    button.textContent = answer.hidden ? 'Revelar gabarito / passo a passo (R)' : 'Ocultar gabarito (R)';
    if (!answer.hidden && answer.querySelector('#debt-chart')) updateChart();
  }));
  function toggleDialog(dialog) { if (dialog.open) dialog.close(); else dialog.showModal(); }
  document.querySelector('#notes-open').addEventListener('click', () => toggleDialog(notes));
  document.querySelector('#score-open').addEventListener('click', () => toggleDialog(score));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  async function toggleFullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (_) { /* Fullscreen may be unavailable in embedded browsers. */ }
  }
  document.querySelector('#fullscreen').addEventListener('click', toggleFullscreen);
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable || (event.target.tagName === 'BUTTON' && event.key === ' ')) return;
    if (event.key.toLowerCase() === 'p' && !score.open) { event.preventDefault(); toggleDialog(notes); return; }
    if (notes.open || score.open) return;
    if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); showSlide(current + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1); }
    else if (event.key.toLowerCase() === 'r') { event.preventDefault(); toggleReveal(); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); }
  });

  let duration = 300, remaining = duration, deadline = null, interval = null;
  const display = document.querySelector('#timer-display');
  const play = document.querySelector('#timer-play');
  function renderTimer() {
    display.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    play.textContent = interval ? 'Pausar' : 'Iniciar';
  }
  function pauseTimer() { if (interval) { remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); clearInterval(interval); interval = null; } renderTimer(); }
  function tick() {
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    if (!remaining) { clearInterval(interval); interval = null; document.querySelector('#timer-status').textContent = 'Tempo encerrado.'; }
    renderTimer();
  }
  play.addEventListener('click', () => {
    if (interval) return pauseTimer();
    if (!remaining) remaining = duration;
    document.querySelector('#timer-status').textContent = '';
    deadline = Date.now() + remaining * 1000; interval = setInterval(tick, 250); renderTimer();
  });
  document.querySelector('#timer-reset').addEventListener('click', () => { pauseTimer(); remaining = duration; renderTimer(); });
  document.querySelectorAll('[data-minutes]').forEach(button => button.addEventListener('click', () => { pauseTimer(); duration = Number(button.dataset.minutes) * 60; remaining = duration; renderTimer(); }));

  const key = 'tesouraria-equipes-v1';
  const defaults = () => Array.from({length: 4}, (_, i) => ({name: `Equipe ${i + 1}`, points: 0}));
  let teams;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    const valid = Array.isArray(saved) && saved.length >= 4 && saved.length <= 6 &&
      saved.every(team => team && typeof team.name === 'string' && Number.isSafeInteger(team.points));
    teams = valid ? saved : defaults();
  } catch { teams = defaults(); }
  function save() { try { localStorage.setItem(key, JSON.stringify(teams)); } catch (_) { /* The scoreboard remains usable for this session. */ } }
  function renderTeams() {
    const list = document.querySelector('#teams'); list.replaceChildren();
    teams.forEach((team, index) => {
      const row = document.createElement('div'); row.className = 'team';
      const input = document.createElement('input'); input.value = team.name; input.maxLength = 40; input.setAttribute('aria-label', `Nome da equipe ${index + 1}`);
      input.addEventListener('input', () => { team.name = input.value; save(); });
      const points = document.createElement('span'); points.className = 'team-score'; points.setAttribute('aria-live', 'polite'); points.textContent = `${team.points} pts`;
      const actions = document.createElement('div'); actions.className = 'team-actions';
      [10, 5, -5].forEach(delta => { const button = document.createElement('button'); button.type = 'button'; button.textContent = delta > 0 ? `+${delta}` : `${delta}`; button.setAttribute('aria-label', `${delta > 0 ? 'Somar' : 'Subtrair'} ${Math.abs(delta)} pontos para ${team.name}`); button.addEventListener('click', () => { team.points += delta; points.textContent = `${team.points} pts`; points.classList.remove('score-changed'); void points.offsetWidth; points.classList.add('score-changed'); save(); }); actions.append(button); });
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remover'; remove.disabled = teams.length <= 4; remove.setAttribute('aria-label', `Remover ${team.name}`); remove.addEventListener('click', () => { teams.splice(index, 1); save(); renderTeams(); }); actions.append(remove);
      row.append(input, points, actions); list.append(row);
    });
    document.querySelector('#add-team').disabled = teams.length >= 6;
  }
  document.querySelector('#add-team').addEventListener('click', () => { if (teams.length < 6) { teams.push({name: `Equipe ${teams.length + 1}`, points: 0}); save(); renderTeams(); } });
  document.querySelector('#reset-scores').addEventListener('click', () => { teams.forEach(team => { team.points = 0; }); save(); renderTeams(); });

  const months = document.querySelector('#months');
  function updateChart() {
    const n = Number(months.value); document.querySelector('#months-value').textContent = n;
    if (!window.Chart) { document.querySelector('#chart-fallback').hidden = false; return; }
    const labels = Array.from({length: n + 1}, (_, i) => `Mês ${i}`);
    const dark = document.documentElement.dataset.theme === 'dark';
    const ink = getComputedStyle(document.body).color;
    const datasets = [
      {label: '5% a.m. simples', borderColor: dark ? '#8bcaff' : '#004587', data: labels.map((_, i) => 10000 * (1 + .05 * i))},
      {label: '5% a.m. composto', borderColor: '#10b981', data: labels.map((_, i) => 10000 * Math.pow(1.05, i))},
      {label: '12% a.m. rotativo', borderColor: '#ef4444', data: labels.map((_, i) => 10000 * Math.pow(1.12, i))}
    ].map(item => ({...item, tension: .15, pointRadius: 2, borderWidth: 3}));
    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets = datasets;
      chart.options.plugins.legend.labels.color = ink;
      chart.options.scales.x.ticks.color = ink;
      chart.options.scales.y.ticks.color = ink;
      chart.update();
      return;
    }
    chart = new Chart(document.querySelector('#debt-chart'), {type:'line', data:{labels,datasets}, options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color: getComputedStyle(document.body).color}}, tooltip:{callbacks:{label: context => `${context.dataset.label}: ${context.parsed.y.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}`}}}, scales:{x:{ticks:{color:getComputedStyle(document.body).color}}, y:{ticks:{color:getComputedStyle(document.body).color, callback:value => 'R$ ' + Number(value).toLocaleString('pt-BR')}}}}});
  }
  months.addEventListener('input', updateChart);
  new MutationObserver(() => { if (chart) updateChart(); })
    .observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  showSlide(0); renderTimer(); renderTeams();
})();
