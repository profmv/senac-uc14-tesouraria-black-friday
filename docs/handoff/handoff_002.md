# Handoff 002 - revisao para professor substituto, baloes e redesenho

Criado: 2026-11-25 18:28
Atualizado: 2026-11-25 18:32
Branch: main | HEAD: 3021941 (publicado em origin/main) | Status: verificado-nao-publicado | Anterior: docs/handoff/handoff_001.md

## INTERROMPIDO EM (18:32)
Passo 6/7 concluido (verificacao). Falta SO o passo 7: atualizar docs/verification.md, commit e push.
Redesenho "vitrine de Black Friday" entregue pelo subagente: assets/slides.css (reescrito legivel), style.css, teaching.css, variaveis.css, slides.js (so animacao do placar), assets/fonts/anton.woff2 (+ anton-LICENSE.txt, OFL; magic wOF2 conferido).
As 18:32, na arvore final: verify_lesson OK (45 baloes, 24 valores) e check_browser OK em http://127.0.0.1:8765/. Slide 3 claro conferido em screenshot (scratchpad\redesign\slide3-desk-light.png): legivel.
Commitar: assets/slides.css assets/slides.js assets/style.css assets/teaching.css assets/variaveis.css assets/fonts/ guia-professor.html slides.html docs/verification.md docs/handoff/handoff_002.md. NAO commitar .governanca/ docs/diario/ docs/licoes/ scripts/.
Pendencias conhecidas do redesenho (nao bloqueiam): gabarito abaixo da dobra em 1280x720 (ja era assim); cronometro cobre pergunta no celular (ja era); cores do Chart.js originais; guia/plano so com tokens e fonte.

## Objetivo e criterio de pronto
Aula de 3h (19:00-22:00, 25/11) de UC 14 (Tecnico em Administracao, Senac) conduzida por professor substituto que nao ensaiou, sala sem laboratorio.
Pronto quando: guia permite conduzir lendo na hora; visual sem cara de IA, animado; `python artifacts/verify_lesson.py` e `python artifacts/check_browser.py <url>` passam; publicado no GitHub Pages (main, raiz).

## PROVADO
- Baloes das variaveis (C, i, t, J, M, valor, fator, potencia): 24 em slides.html, 21 em guia-professor.html; verify_lesson e check_browser passaram (http://127.0.0.1:8765/); balao abre no slide 3 (visto no navegador). Commit 3021941, push feito 18:24.
- Pages: https://profmv.github.io/senac-uc14-tesouraria-black-friday/ status built, source main.
- UC 14 (PDF do plano de curso, pp. 31-33 e 50): "Executar os processos referentes a tesouraria, contas a pagar e receber", 72 h; conhecimentos incluem "porcentagem, regra de tres simples, razoes e proporcoes, juros simples e compostos"; orientacao sugere jogo de simulacao de tesouraria.
- Revisao Opus: veredito "sustenta com ajustes"; todas as contas conferidas com node.
- Edicoes de texto no guia (apos revisao) passaram no verify_lesson as 18:28.

## NAO PROVADO
- Redesenho visual (subagente Opus em andamento): ainda nao entregue nem verificado.
- check_browser apos as edicoes de texto do guia e do redesenho.
- Toque em celular real nos baloes.
- Conteudo dos audios do WhatsApp (.ogg em Downloads): nao transcritos (sem whisper; instalar exige OK do usuario).

## Feito nesta sessao
- assets/variaveis.js, variaveis.css, variaveis-dados.js; marcacao button.var em slides.html e guia-professor.html; checagem em artifacts/verify_lesson.py; secao em docs/verification.md (commit 3021941).
- guia-professor.html (nao commitado): caixa "Antes de entrar na sala" apos .overview; em cada bloco, slide a projetar e teclas; apresentacao do substituto e chamada; fala "juro sobre juro" + 3 exercicios em dupla (B2); R2 "sobre o total" + nota parcela a parcela (R$ 1.500 / R$ 28.500); plano de corte se atrasar (B5); tarefa extra para equipe rapida; saida individual fixa (R$ 5.000, 3% a.m., 2 meses: 5.300,00 x 5.304,50, dif. 4,50) com recolha e foto do placar.
- slides.html slide 6: "2,5% a.m. simples sobre o total, por 3 meses".
- Licao L001 (heredoc no bash quebra JS) em docs/licoes/.

## Decisoes
- Publicar a versao com baloes antes do redesenho para garantir algo estavel as 19:00 (Claude, por prazo).
- Nao mudar regra de pontuacao (-5) nem numeros/cenarios; AGENTS.md manda preservar 4 cenarios, tempos e URLs.
- Pastas de plugin (.governanca/, docs/diario/, docs/licoes/, scripts/) ficam fora dos commits (usuario nao pediu incluir).
- NAO REABRIR: auto-link por regex de letras (quebraria "i"/"t" em palavras); marcacao manual.

## Proximo passo
1. Aguardar relatorio do subagente de redesenho; conferir screenshots em scratchpad\redesign\.
2. Rodar verify_lesson e check_browser (servidor local); revisar slide 3, 5, 8 em claro/escuro.
3. Atualizar docs/verification.md (texto do guia + redesenho); commit; push para Pages.
4. Se redesenho falhar ou atrasar: commitar e publicar so as edicoes de texto do guia.

## Riscos
- Redesenho pode quebrar check_browser (#slide-count "2 / 11", .answer, Chart.js, overflow 390px).
- Notas do apresentador (tecla P) aparecem no projetor se a tela estiver espelhada.

## Comandos
- python artifacts/verify_lesson.py
- python -m http.server 8765 --bind 127.0.0.1 ; python artifacts/check_browser.py http://127.0.0.1:8765/

## Prompt de retomada
No repo C:\Repo\Ensino-Educacao\PLANEJAMENTO\plan-adm-matematica-24nov (site estatico pt-BR, GitHub Pages da main), termine a entrega: confira o redesenho visual (CSS em assets/), rode verify_lesson e check_browser, atualize docs/verification.md, faca commit so dos arquivos do site (nao das pastas de plugin) e push. Nao altere numeros, cenarios, tempos nem quantidade de slides.
