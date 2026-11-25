# Classroom release verification

The integrated site passed the calculation and browser checks before the initial publication. The verification scripts are in artifacts and the PROVA records are in governance.db.

| Scope | Evidence |
| --- | --- |
| Arithmetic and content | Recalculated 24 monetary amounts using decimal arithmetic and checked the results against both the presentation and the guide. Checked the 23.5% effective discount, four rounds and seven consecutive timetable blocks totaling 180 minutes. |
| Static delivery | Parsed all four pages as HTML5, checked their local references and unique IDs, decoded text as UTF-8, inspected the empty .nojekyll file and ran Node syntax checks. |
| Chrome on desktop | Exercised fullscreen, slide navigation, teacher notes, progressive reveals, timer, team limits and score persistence, and compared the six-month chart outputs. |
| Chrome on mobile | Exercised all four pages at 390 pixels, checked page widths, restored a checked guide block after reloading, and checked print control visibility. |
| Simulator | Exercised comma decimals, independent invalid input handling, restoration of results, and live recalculation. |

The integration review corrected the percentage-to-decimal notation in the teacher guide and a lesson-plan table that widened the mobile page. Chart text and line colors respond to theme changes. Printing and audience visibility on a specific physical projector depend on the classroom equipment.

## Balões das variáveis (2026-11-25)

As variáveis das fórmulas em slides.html e guia-professor.html (C, i, t, J, M, valor, fator, xʸ) são botões `button.var[data-var]` que abrem um balão único (`#var-pop`, role tooltip) com nome, ideia, detalhe, exemplo da aula e, quando existe, um aviso de cuidado. O conteúdo vem de assets/variaveis-dados.js (`window.VARIAVEIS`); o comportamento está em assets/variaveis.js e o visual em assets/variaveis.css. O texto é inserido com textContent, sem HTML.

| Verificação | Como |
| --- | --- |
| Automática | `python artifacts/verify_lesson.py` confere que todo `data-var` existe em variaveis-dados.js e que as duas páginas carregam o CSS, os dados e o script (dados antes do script). |
| Mouse e foco | Passar o mouse ou focar com Tab em uma variável abre o balão; sair fecha após cerca de 160 ms; o balão fica aberto enquanto o foco está no botão. |
| Toque | Um toque abre; novo toque na mesma variável fecha; toque fora fecha. |
| Esc | Com o balão aberto, Esc fecha só o balão e o foco permanece na variável. Setas e Espaço continuam navegando os slides; trocar de slide fecha o balão. |
| Tela cheia | Em slides.html, tecla F e abrir uma variável: o balão aparece. O script move o balão para `document.fullscreenElement` quando ele não é o elemento raiz. Nota: o Esc do navegador sai da tela cheia por conta própria. |
| 390 px e temas | Sem rolagem horizontal; largura máxima do balão min(20rem, 100vw − 1.5rem); conferir nos temas claro e escuro. |

## Revisão para substituto e redesenho visual (2026-11-25 18:32)

- Guia: caixa "Antes de entrar na sala", slide e teclas por bloco, exercícios do nivelamento, plano de corte, tarefa extra, saída individual fixa (R$ 5.300,00 × R$ 5.304,50) com recolha e foto do placar. R2 passa a dizer "sobre o total".
- Visual "vitrine de Black Friday" (Anton local em assets/fonts, OFL), animações de entrada, carimbo ao revelar gabarito, animação do placar, `prefers-reduced-motion`.
- `python artifacts/verify_lesson.py` e `python artifacts/check_browser.py http://127.0.0.1:8765/` passaram na árvore final.
