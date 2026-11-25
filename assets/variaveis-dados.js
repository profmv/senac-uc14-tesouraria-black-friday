// Conteúdo dos balões das variáveis (ver assets/variaveis.js).
window.VARIAVEIS = {
  C: {
    simbolo: 'C',
    nome: 'Capital',
    ideia: 'É o dinheiro do começo da história: o que você pegou emprestado, aplicou ou deve hoje, antes de qualquer juro.',
    detalhe: 'No mercado também aparece como valor presente ou principal. Em reais, e sai do enunciado: é o valor da dívida ou da aplicação na data inicial.',
    exemplo: 'Aplicação de R$ 40.000,00 a 1% a.m.: C = 40.000. Empréstimo de R$ 30.000,00 a 2,5% a.m.: C = 30.000.',
    cuidado: 'Não confunda com o total final. Se o enunciado já traz o valor com juros, esse é o M, não o C.'
  },
  i: {
    simbolo: 'i',
    nome: 'Taxa por período',
    ideia: 'É o preço do dinheiro: quanto de cada R$ 100,00 vira juro a cada período, escrito como porcentagem ou como número decimal.',
    detalhe: 'Na fórmula, use sempre o decimal: divida por 100. A unidade da taxa (a.m., a.a.) tem de ser a mesma de t; se não for, converta antes.',
    exemplo: '15% = 0,15; 5% = 0,05; 2,5% a.m. = 0,025. Com t = 3 meses, a taxa a.m. combina com o t em meses.',
    cuidado: '0,5 é 50%, não 0,5%. Já 0,5% é 0,005. Taxa ao mês com t em anos dá resultado errado.'
  },
  t: {
    simbolo: 't',
    nome: 'Número de períodos',
    ideia: 'É quantas vezes a taxa é aplicada: quantos meses, anos ou dias o dinheiro fica rendendo ou a dívida fica correndo.',
    detalhe: 'O período é o da taxa: taxa ao mês pede t em meses. Se o prazo vier em outra unidade, converta o prazo ou a taxa antes de calcular.',
    exemplo: 'Taxa de 5% a.m. por 4 meses: t = 4. Rotativo de 12% a.m. por 6 meses: t = 6. Investimento de 1% a.m. por 3 meses: t = 3.',
    cuidado: 'Um prazo de 1 ano com taxa mensal não é t = 1, e sim t = 12.'
  },
  J: {
    simbolo: 'J',
    nome: 'Juros',
    ideia: 'É o aluguel do dinheiro: a diferença entre o que volta no final e o que saiu no começo. Quem toma emprestado paga; quem aplica recebe.',
    detalhe: 'Em juros simples, J = C × i × t: cada período rende o mesmo valor, porque a conta sempre parte do capital inicial.',
    exemplo: 'C = 30.000, i = 0,025, t = 3: J = 30.000 × 0,025 × 3 = R$ 2.250,00. Com 10.000 a 5% a.m. por 4 meses: J = R$ 2.000,00.',
    cuidado: 'Nos juros compostos não use C × i × t. Calcule o M e depois J = M − C (ex.: 12.155,06 − 10.000 = 2.155,06).'
  },
  M: {
    simbolo: 'M',
    nome: 'Montante',
    ideia: 'É o valor final, o total que está na conta ou que precisa ser pago na data combinada: o dinheiro do começo mais o que ele rendeu.',
    detalhe: 'Em juros simples, M = C + J. Em juros compostos, vem direto de M = C × (1 + i)^t, sem calcular J antes.',
    exemplo: 'Simples: 10.000 + 2.000 = R$ 12.000,00. Composto: 10.000 × 1,05⁴ = R$ 12.155,06. Investimento: 40.000 vira R$ 41.212,04.',
    cuidado: 'Montante não é lucro. O ganho bruto é M − C: no investimento, 41.212,04 − 40.000 = R$ 1.212,04.'
  },
  valor: {
    simbolo: 'valor',
    nome: 'Valor de partida',
    ideia: 'É o preço ou a quantia com que a conta de porcentagem começa, antes de aplicar o acréscimo ou o desconto.',
    detalhe: 'O resultado é sempre calculado sobre o valor que está na mão naquele passo. Em contas em sequência, o valor de partida muda a cada etapa.',
    exemplo: 'Produto de R$ 100,00 com +20%: valor = 100, resultado R$ 120,00. No desconto seguinte, o valor de partida passa a ser 120.',
    cuidado: 'Descontar 20% do preço já acrescido de 20% não devolve R$ 100,00: dá R$ 96,00, porque a base mudou.'
  },
  fator: {
    simbolo: 'fator',
    nome: 'Fator multiplicador',
    ideia: 'É o número único pelo qual você multiplica o valor para já obter o resultado com acréscimo (1 + i) ou com desconto (1 − i).',
    detalhe: 'Acréscimo de 20% dá fator 1,20; desconto de 20% dá fator 0,80. Fatores de etapas seguidas se multiplicam entre si.',
    exemplo: '100 × 1,20 = 120; depois 120 × 0,80 = 96,00: perdeu 4%. Cascata de 15% e 10%: 20.000 × 0,85 × 0,90 = 15.300 (23,5%, não 25%).',
    cuidado: 'Descontos em cascata não se somam. 15% e depois 10% dão 23,5% de desconto efetivo, não 25%.'
  },
  potencia: {
    simbolo: 'xʸ',
    nome: 'Potência',
    ideia: 'É a forma curta de multiplicar o fator por ele mesmo, uma vez para cada período. O expoente t diz quantas vezes repetir.',
    detalhe: 'Na calculadora, use a tecla xʸ (ou ^): digite o fator, aperte xʸ, digite t e aperte igual. No celular, gire para a horizontal.',
    exemplo: '1,05⁴ = 1,05 × 1,05 × 1,05 × 1,05 = 1,21550625. Então 10.000 × 1,21550625 = R$ 12.155,06. Rotativo: 10.000 × 1,12⁶ = R$ 19.738,23.',
    cuidado: 'O expoente vale só para o fator (1 + i). Não eleve o capital: C × (1 + i)^t, e não (C × (1 + i))^t.'
  }
};
