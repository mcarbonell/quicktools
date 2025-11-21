import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-16 sm:py-24">
      {/* Background blobs */}
      <div className="absolute -left-4 top-0 h-72 w-72 animate-blob rounded-full bg-primary-500/10 blur-3xl filter"></div>
      <div className="absolute right-0 top-0 h-72 w-72 animate-blob rounded-full bg-ai/10 blur-3xl filter" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-local-dark/30 px-3 py-1 text-xs font-semibold text-local-light ring-1 ring-inset ring-local/30">
            <Zap size={14} />
            Proceso Local Instantáneo
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ai-dark/30 px-3 py-1 text-xs font-semibold text-ai-light ring-1 ring-inset ring-ai/30">
            <Cpu size={14} />
            Powered by Gemini AI
          </span>
        </div>

        <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Todas las herramientas.<br />
          <span className="bg-gradient-to-r from-primary-400 to-ai text-transparent bg-clip-text">Un solo lugar.</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Una colección curada de utilidades esenciales para desarrolladores y creativos.
          Usa herramientas 100% privadas en tu navegador o conecta tu propia API Key para desbloquear la IA.
        </p>
      </div>
    </div>
  );
};