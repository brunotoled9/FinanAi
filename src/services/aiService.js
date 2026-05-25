export const SYSTEM_PROMPT = `Você é o FinanAI, um assistente financeiro inteligente.
Sua função é analisar transações financeiras pessoais.
Sempre identifique:
- Se a transação é receita ou despesa;
- A categoria mais adequada;
- Uma análise objetiva;
- Uma recomendação prática de economia ou organização.

Regras:
- Responda sempre em JSON válido.
- Não escreva nenhum texto fora do JSON.
- Use linguagem simples e profissional.
- Caso a categoria não esteja clara, use "Outros".
- As categorias permitidas são: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Compras, Salário, Outros.
- O campo tipo deve ser apenas "receita" ou "despesa".

Formato obrigatório:

{
  "tipo": "receita ou despesa",
  "categoria": "categoria",
  "analise": "análise curta",
  "recomendacao": "recomendação personalizada"
}`;

const fallbackAnalyze = (description, value) => {
  const desc = description.toLowerCase();
  
  // Regras de fallback simples baseadas em palavras-chave
  const keywordMap = {
    Transporte: ['uber', '99', 'ônibus', 'onibus', 'combustível', 'gasolina', 'passagem', 'metrô'],
    Alimentação: ['mercado', 'almoço', 'restaurante', 'ifood', 'padaria', 'lanche', 'pizza'],
    Salário: ['salário', 'pagamento', 'freelance', 'pix', 'recebimento'],
    Saúde: ['farmácia', 'remédio', 'consulta', 'médico', 'dentista', 'hospital'],
    Educação: ['faculdade', 'curso', 'livro', 'mensalidade', 'escola'],
    Lazer: ['netflix', 'cinema', 'jogo', 'show', 'spotify', 'bar', 'festa'],
    Compras: ['shopping', 'roupa', 'sapato', 'eletrônico', 'amazon', 'mercado livre']
  };

  let categoria = 'Outros';
  let tipo = 'despesa';

  if (desc.includes('salário') || desc.includes('freelance') || desc.includes('renda') || value > 0) {
     tipo = 'receita'; // se for positivo ou conter palavra-chave, mas vamos basear no keyword map primeiro para tipo
  }

  // Tentar encontrar categoria pelas palavras-chave
  for (const [cat, words] of Object.entries(keywordMap)) {
    if (words.some(word => desc.includes(word))) {
      categoria = cat;
      if (cat === 'Salário') tipo = 'receita';
      break;
    }
  }

  return {
    tipo,
    categoria,
    analise: `Classificação simulada via IA de contingência para "${description}".`,
    recomendacao: "Configure a API Key da OpenAI para análises reais e mais detalhadas."
  };
};

export const analyzeTransaction = async (description, value, apiKey) => {
  if (!apiKey) {
    return fallbackAnalyze(description, value);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Usando um modelo padrão, mas pode ser 4o-mini
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Transação: ${description} | Valor: R$ ${value}` }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.warn("Erro na API da OpenAI, usando fallback. Status:", response.status);
      return fallbackAnalyze(description, value);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Tenta fazer o parse do JSON retornado pela IA
    try {
      const jsonStr = content.substring(content.indexOf("{"), content.lastIndexOf("}") + 1);
      const result = JSON.parse(jsonStr);
      
      // Validação básica
      if (!result.tipo || !result.categoria) {
         throw new Error("JSON incompleto");
      }
      return result;
    } catch (e) {
      console.error("Erro ao fazer parse do JSON da IA:", content, e);
      return fallbackAnalyze(description, value);
    }

  } catch (error) {
    console.error("Erro na chamada de IA:", error);
    return fallbackAnalyze(description, value); // Fallback caso dê erro de rede, etc
  }
};
