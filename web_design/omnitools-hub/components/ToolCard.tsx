import React from 'react';
import { Tool, ToolCategory, ToolStatus } from '../types';
import { ArrowRight, Lock, Cloud } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const isAi = tool.category === ToolCategory.AI;
  const isConcept = tool.status === ToolStatus.CONCEPT;

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-900/20 ${isConcept ? 'opacity-75 grayscale transition-none hover:grayscale-0 hover:opacity-100' : ''}`}>
      
      {/* Glow Effect on Hover */}
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${isAi ? 'from-ai/10 via-transparent to-transparent' : 'from-primary-500/10 via-transparent to-transparent'}`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isAi ? 'bg-ai/20 text-ai-light' : 'bg-local/20 text-local-light'}`}>
          <tool.icon size={24} />
        </div>
        
        <div className="flex gap-2">
          {isConcept && (
            <span className="inline-flex items-center rounded-md bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-600/50">
              Concepto
            </span>
          )}
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${isAi ? 'bg-ai/10 text-ai-light ring-ai/30' : 'bg-local/10 text-local-light ring-local/30'}`}>
            {isAi ? 'IA' : 'Local'}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex-1">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
          {tool.title}
        </h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-700/50 pt-4">
        <div className="flex gap-2 overflow-hidden text-xs text-slate-500">
           {isAi ? <Cloud size={14} /> : <Lock size={14} />}
           <span>{isAi ? 'Requiere Key' : 'Privacidad Total'}</span>
        </div>
        
        <button 
          disabled={isConcept}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${isConcept ? 'cursor-not-allowed text-slate-600' : 'text-primary-400 group-hover:text-primary-300'}`}
        >
          {isConcept ? 'Pronto' : 'Abrir'} 
          {!isConcept && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
        </button>
      </div>
    </div>
  );
};