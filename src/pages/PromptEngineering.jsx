import React from 'react';
import { Terminal, Check, X, ShieldCheck, Sparkles, Binary, Settings, Code2 } from 'lucide-react';

const PromptEngineering = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-400" size={32} />
          <h1 className="text-3xl font-bold">O Segredo do FinanAI</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
          <strong className="text-white">A construção de prompts bem estruturados foi essencial para garantir respostas consistentes e úteis da IA.</strong><br/>
          Sem uma engenharia de prompt adequada, a IA geraria textos longos, alucinaria categorias e quebraria a aplicação. Entenda abaixo como evoluímos o comando.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Terminal size={24} className="text-blue-600" />
          Evolução dos Prompts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Prompt Ruim */}
          <div className="card border-red-200 bg-red-50/30">
            <div className="flex items-center gap-2 text-red-600 mb-3 font-bold">
              <X size={20} />
              Prompt Ruim
            </div>
            <div className="bg-white p-3 rounded border border-red-100 font-mono text-sm text-slate-700 mb-4 h-24">
              "Classifique esse gasto."
            </div>
            <p className="text-sm text-slate-600">
              <strong>Problema:</strong> Muito vago. A IA pode responder com um texto de 3 parágrafos, inventar categorias ("Transporte Urbano Noturno") e não dizer se é receita ou despesa.
            </p>
          </div>

          {/* Prompt Melhor */}
          <div className="card border-amber-200 bg-amber-50/30">
            <div className="flex items-center gap-2 text-amber-600 mb-3 font-bold">
              <Check size={20} />
              Prompt Melhor
            </div>
            <div className="bg-white p-3 rounded border border-amber-100 font-mono text-sm text-slate-700 mb-4 h-24">
              "Classifique a transação informando categoria, tipo e uma recomendação."
            </div>
            <p className="text-sm text-slate-600">
              <strong>Problema:</strong> Melhor, mas ainda imprevisível. A IA pode retornar um formato de texto livre ("A categoria é Alimentação e o tipo é despesa..."), impossível de ser lido automaticamente pelo código.
            </p>
          </div>

          {/* Prompt Avançado */}
          <div className="card border-emerald-200 bg-emerald-50/30 ring-2 ring-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-600 mb-3 font-bold">
              <ShieldCheck size={20} />
              Prompt Avançado (FinanAI)
            </div>
            <div className="bg-white p-3 rounded border border-emerald-100 font-mono text-xs text-slate-800 mb-4 h-24 overflow-y-auto leading-relaxed shadow-inner">
              "Você é um assistente financeiro. Analise a transação enviada pelo usuário, identifique se é receita ou despesa, classifique em uma categoria financeira, gere uma análise curta e uma recomendação prática. Responda obrigatoriamente em JSON válido, sem texto fora do JSON."
            </div>
            <p className="text-sm text-slate-600">
              <strong>Resultado:</strong> Consistência total. Restringe o formato (JSON), define o papel (Assistente Financeiro) e limita as respostas, garantindo integração perfeita com o React.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Por que essas técnicas são cruciais?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 h-fit">
              <Binary size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Uso de JSON Estruturado</h3>
              <p className="text-sm text-slate-600 mt-1">
                Força a IA a retornar dados organizados em pares (chave: valor). Isso permite que a aplicação extraia facilmente a <code>categoria</code> para gerar gráficos, sem precisar "ler" o texto.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600 h-fit">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Limitação de Categorias</h3>
              <p className="text-sm text-slate-600 mt-1">
                Passar uma lista fechada (Alimentação, Saúde, Lazer...) impede que a IA crie categorias infinitas. Isso garante que os gráficos de pizza façam sentido e agrupem os dados corretamente.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 h-fit">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Controle de Regras e Restrições</h3>
              <p className="text-sm text-slate-600 mt-1">
                Dizer à IA "Responda obrigatoriamente sem texto fora do JSON" evita que ela adicione cumprimentos como "Aqui está sua análise: {`{...}`}", o que causaria um Crash imediato no sistema ao tentar ler os dados.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 h-fit">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Padronização das Respostas</h3>
              <p className="text-sm text-slate-600 mt-1">
                A padronização permite previsibilidade. Saberemos sempre que o campo <code>tipo</code> será "receita" ou "despesa", facilitando aplicar cores (verde/vermelho) ou cálculos matemáticos na interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEngineering;
