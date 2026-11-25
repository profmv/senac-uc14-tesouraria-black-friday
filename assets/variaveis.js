(() => {
  'use strict';
  const POPOVER_ID = 'var-pop';
  const CLOSE_DELAY = 160;
  const MARGIN = 12;
  const GAP = 8;
  let popover = null;
  let openButton = null;
  let closeTimer = 0;
  let wasOpenOnPointerDown = false;
  let lastPointerType = 'mouse';

  // In fullscreen only the fullscreen element's subtree is rendered, so the balloon must live inside it.
  // slides.js fullscreens documentElement (body is inside it), which is also fine.
  function host() {
    const full = document.fullscreenElement;
    return full && full !== document.documentElement ? full : document.body;
  }

  function ensurePopover() {
    if (popover) return;
    popover = document.createElement('div');
    popover.id = POPOVER_ID;
    popover.className = 'var-pop';
    popover.setAttribute('role', 'tooltip');
    popover.dataset.open = 'false';
    document.body.append(popover);
  }

  function para(className, text) {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    return p;
  }

  function fill(entry) {
    const title = document.createElement('strong');
    title.className = 'var-pop-title';
    title.textContent = `${entry.simbolo} — ${entry.nome}`;
    const nodes = [title, para('var-pop-text', entry.ideia), para('var-pop-text', entry.detalhe)];
    const example = document.createElement('div');
    example.className = 'var-pop-example';
    const label = document.createElement('span');
    label.className = 'var-pop-label';
    label.textContent = 'Exemplo da aula';
    const code = document.createElement('code');
    code.textContent = entry.exemplo;
    example.append(label, code);
    nodes.push(example);
    if (entry.cuidado) nodes.push(para('var-pop-warn', `Cuidado: ${entry.cuidado}`));
    popover.replaceChildren(...nodes);
  }

  function place(button) {
    const rects = button.getClientRects();
    if (!rects.length) return false;
    const first = rects[0];
    const last = rects[rects.length - 1];
    const viewW = document.documentElement.clientWidth;
    const viewH = window.innerHeight;
    if (last.bottom < 0 || first.top > viewH) return false;
    popover.style.maxHeight = '';
    const width = popover.offsetWidth;
    let height = popover.offsetHeight;
    let left = Math.min(first.left, viewW - width - MARGIN);
    left = Math.max(left, MARGIN);
    const edge = MARGIN / 2;
    const roomBelow = viewH - last.bottom - GAP - edge;
    const roomAbove = first.top - GAP - edge;
    const below = roomBelow >= height || (roomAbove < height && roomBelow >= roomAbove);
    const room = below ? roomBelow : roomAbove;
    // When neither side fits the whole balloon, shrink it to the larger side (it scrolls) instead of covering the variable.
    if (height > room) {
      height = Math.max(room, 0);
      popover.style.maxHeight = `${Math.floor(height)}px`;
    }
    const top = below ? last.bottom + GAP : first.top - height - GAP;
    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(Math.max(MARGIN / 2, top))}px`;
    popover.dataset.side = below ? 'below' : 'above';
    return true;
  }

  function open(button) {
    clearTimeout(closeTimer);
    if (openButton === button) return;
    const entry = (window.VARIAVEIS || {})[button.dataset.var];
    if (!entry) {
      console.warn(`variaveis.js: chave "${button.dataset.var}" não existe em VARIAVEIS.`);
      return;
    }
    if (openButton) close(true);
    ensurePopover();
    const target = host();
    if (popover.parentNode !== target) target.append(popover);
    fill(entry);
    popover.dataset.open = 'true';
    if (!place(button)) {
      popover.dataset.open = 'false';
      return;
    }
    openButton = button;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-describedby', POPOVER_ID);
  }

  function close(immediate = false) {
    clearTimeout(closeTimer);
    if (!openButton) return;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.removeAttribute('aria-describedby');
    openButton = null;
    popover.dataset.open = 'false';
    if (immediate) popover.dataset.instant = 'true';
    else delete popover.dataset.instant;
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => close(), CLOSE_DELAY);
  }

  const varFrom = target => (target instanceof Element ? target.closest('button.var[data-var]') : null);
  const inPopover = target => Boolean(popover && target instanceof Node && popover.contains(target));

  function reposition() {
    if (openButton && (!openButton.isConnected || !place(openButton))) close(true);
  }

  document.querySelectorAll('button.var[data-var]').forEach(button => button.setAttribute('aria-expanded', 'false'));

  document.addEventListener('mouseover', event => {
    const button = varFrom(event.target);
    if (button) open(button);
    else if (inPopover(event.target)) clearTimeout(closeTimer);
  });
  document.addEventListener('mouseout', event => {
    const leaving = varFrom(event.target) || (inPopover(event.target) ? popover : null);
    if (!leaving || !openButton) return;
    const into = event.relatedTarget;
    if (into instanceof Node && (leaving.contains(into) || inPopover(into) || varFrom(into) === openButton)) return;
    if (document.activeElement === openButton && leaving !== popover) return;
    scheduleClose();
  });
  document.addEventListener('focusin', event => {
    const button = varFrom(event.target);
    if (button) open(button);
  });
  document.addEventListener('focusout', event => {
    const button = varFrom(event.target);
    if (button && openButton === button) scheduleClose();
  });
  document.addEventListener('pointerdown', event => {
    lastPointerType = event.pointerType;
  }, true);
  document.addEventListener('pointerdown', event => {
    const button = varFrom(event.target);
    wasOpenOnPointerDown = Boolean(button && button === openButton);
    if (!button && openButton && !inPopover(event.target)) close();
  });
  document.addEventListener('click', event => {
    const button = varFrom(event.target);
    if (!button) return;
    // Touch taps toggle; mouse and keyboard activation keep the balloon open.
    if (wasOpenOnPointerDown && event.detail > 0 && lastPointerType === 'touch') close();
    else open(button);
    wasOpenOnPointerDown = false;
  });
  document.addEventListener('keydown', event => {
    if (!openButton) return;
    if (event.key === 'Escape') {
      // Close only the balloon; focus stays on the variable.
      event.stopPropagation();
      close();
    } else {
      // Slide navigation may hide the variable: re-check after the key is handled.
      requestAnimationFrame(reposition);
    }
  }, true);
  document.addEventListener('fullscreenchange', () => {
    if (!popover) return;
    const target = host();
    if (popover.parentNode !== target) target.append(popover);
    reposition();
  });
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, { capture: true, passive: true });
})();
