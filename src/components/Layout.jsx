import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Target, Bot, Settings, Menu, X, Wallet } from 'lucide-react';
import { storageService } from '../services/storageService';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const location = useLocation();

  useEffect(() => {
    setApiKey(storageService.getApiKey());
  }, []);

  const handleSaveApiKey = () => {
    storageService.saveApiKey(apiKey);
    setIsSettingsOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transações', icon: <Receipt size={20} /> },
    { path: '/reports', label: 'Relatórios', icon: <PieChart size={20} /> },
    { path: '/goals', label: 'Metas Financeiras', icon: <Target size={20} /> },
    { path: '/prompt', label: 'Engenharia de Prompt', icon: <Bot size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wallet size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">FinanAI</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Settings size={20} />
            <span>Configurações API</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 md:flex-none flex items-center justify-end">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                {apiKey ? 'IA Ativa (Real)' : 'IA Simulada'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          <Outlet />
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Configurações</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Chave da API OpenAI (Opcional)
                </label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="input-field"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Se não informada, o sistema funcionará normalmente usando um modelo de IA simulado localmente para demonstração.
                </p>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveApiKey}
                  className="btn-primary"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
