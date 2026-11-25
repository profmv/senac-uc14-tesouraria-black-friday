(() => {
  const byId = id => document.getElementById(id);
  if (!byId('simulador')) return;
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 10 });
  const compact = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
  const parse = value => {
    const text = value.trim().replace(/\s/g, '');
    if (!text || !/^(?:\d+(?:[.,]\d+)?|\d{1,3}(?:\.\d{3})+(?:,\d+)?)$/.test(text)) return NaN;
    return Number(text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : (/^\d{1,3}(?:\.\d{3})+$/.test(text) ? text.replace(/\./g, '') : text));
  };
  const validate = specs => specs.map(([id, min, max, integer]) => {
    const input = byId(id), value = parse(input.value);
    const valid = Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value));
    input.setAttribute('aria-invalid', String(!valid));
    return valid ? value : null;
  });
  let chart;
  function updateFactor() {
    const [base, percent] = validate([['sim-factor-value',0,1e9],['sim-factor-rate',0,100]]);
    const valid = base !== null && percent !== null;
    byId('sim-factor-results').hidden = !valid;
    byId('sim-factor-feedback').textContent = valid ? '' : 'Informe um valor de R$ 0 a R$ 1 bilhão e um percentual de 0 a 100%.';
    if (!valid) return;
    const factor = percent / 100;
    byId('sim-increase').textContent = money.format(base * (1 + factor));
    byId('sim-discount').textContent = money.format(base * (1 - factor));
    byId('sim-increase-formula').textContent = `${decimal.format(base)} x ${decimal.format(1 + factor)}`;
    byId('sim-discount-formula').textContent = `${decimal.format(base)} x ${decimal.format(1 - factor)}`;
  }
  function chartTheme() {
    if (!chart) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = dark ? '#d5e5ef' : '#40576a';
    const grid = dark ? '#38566b' : '#dbe5ec';
    chart.options.plugins.legend.labels.color = color;
    for (const axis of [chart.options.scales.x, chart.options.scales.y]) {
      axis.ticks.color = color;
      axis.grid.color = grid;
    }
    chart.options.scales.x.title.color = color;
    chart.update();
  }
  function updateInterest() {
    const [capital, rate, months] = validate([['sim-capital',0,1e9],['sim-rate',0,100],['sim-months',1,120,true]]);
    const valid = capital !== null && rate !== null && months !== null;
    byId('sim-interest-results').hidden = !valid;
    byId('sim-interest-feedback').textContent = valid ? '' : 'Informe capital de R$ 0 a R$ 1 bilhão, taxa de 0 a 100% e prazo inteiro de 1 a 120 meses.';
    if (!valid) return;
    const i = rate / 100;
    const simple = capital * (1 + i * months), compound = capital * Math.pow(1 + i, months);
    byId('sim-simple').textContent = money.format(simple);
    byId('sim-compound').textContent = money.format(compound);
    byId('sim-simple-interest').textContent = `Juros: ${money.format(simple - capital)}`;
    byId('sim-compound-interest').textContent = `Juros: ${money.format(compound - capital)}`;
    byId('sim-difference').textContent = money.format(compound - simple);
    const labels = Array.from({length: months + 1}, (_, n) => n);
    const simpleData = labels.map(n => capital * (1 + i * n));
    const compoundData = labels.map(n => capital * Math.pow(1 + i, n));
    if (typeof Chart === 'undefined') { byId('sim-interest-feedback').textContent = 'O gráfico está indisponível; os cálculos permanecem disponíveis.'; return; }
    if (!chart) {
      chart = new Chart(byId('sim-chart'), {type:'line',data:{labels,datasets:[{label:'Simples',data:simpleData,borderColor:'#10b981',backgroundColor:'#10b981',tension:.25,pointRadius:2},{label:'Compostos',data:compoundData,borderColor:'#f7941d',backgroundColor:'#f7941d',tension:.25,pointRadius:2}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{}},tooltip:{callbacks:{label:ctx => `${ctx.dataset.label}: ${money.format(ctx.parsed.y)}`}}},scales:{x:{ticks:{},grid:{},title:{display:true,text:'Meses'}},y:{grid:{},ticks:{callback:value => `R$ ${compact.format(value)}`}}}}});
    } else { chart.data.labels = labels; chart.data.datasets[0].data = simpleData; chart.data.datasets[1].data = compoundData; }
    chartTheme();
  }
  ['sim-factor-value','sim-factor-rate'].forEach(id => byId(id).addEventListener('input', updateFactor));
  ['sim-capital','sim-rate','sim-months'].forEach(id => byId(id).addEventListener('input', updateInterest));
  new MutationObserver(chartTheme).observe(document.documentElement, {attributes:true,attributeFilter:['data-theme']});
  updateFactor();
  updateInterest();
})();
