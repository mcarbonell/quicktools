import React from 'react';
import { Terminal, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-ai text-white shadow-lg shadow-primary-500/20">
              <Terminal size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">OmniTools</h1>
              <span className="text-xs font-medium text-slate-400">Local & AI Suite</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="group flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 transition-all hover:border-primary-500 hover:text-white"
              onClick={() => alert('Aquí iría la configuración de la API Key de Gemini (BYOK)')}
            >
              <Settings size={16} className="group-hover:animate-spin-slow" />
              <span className="hidden sm:block">Configurar Key</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};