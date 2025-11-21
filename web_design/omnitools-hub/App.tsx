import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { TOOLS } from './constants';
import { ToolCategory } from './types';
import { Search, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(ToolCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = activeCategory === ToolCategory.ALL || 
                             (activeCategory === ToolCategory.AI && tool.category === ToolCategory.AI) ||
                             (activeCategory === ToolCategory.LOCAL && tool.category === ToolCategory.LOCAL);
      
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      
      <main>
        <Hero />

        {/* Controls Section */}
        <div className="sticky top-16 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Category Tabs */}
              <div className="flex space-x-1 rounded-xl bg-slate-900 p-1 shadow-inner shadow-black/20">
                <button
                  onClick={() => setActiveCategory(ToolCategory.ALL)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeCategory === ToolCategory.ALL ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveCategory(ToolCategory.LOCAL)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeCategory === ToolCategory.LOCAL ? 'bg-local/20 text-local-light shadow-sm ring-1 ring-inset ring-local/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${activeCategory === ToolCategory.LOCAL ? 'bg-local' : 'bg-slate-600'}`}></span>
                  Local Tools
                </button>
                <button
                  onClick={() => setActiveCategory(ToolCategory.AI)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeCategory === ToolCategory.AI ? 'bg-ai/20 text-ai-light shadow-sm ring-1 ring-inset ring-ai/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${activeCategory === ToolCategory.AI ? 'bg-ai' : 'bg-slate-600'}`}></span>
                  AI Suite
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar herramientas..."
                  className="block w-full rounded-xl border-0 bg-slate-900 py-2.5 pl-10 pr-4 text-slate-200 ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {filteredTools.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center">
              <div className="rounded-full bg-slate-800 p-4 text-slate-500">
                <Filter size={32} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">No se encontraron herramientas</h3>
              <p className="mt-2 text-slate-400">Intenta ajustar tu búsqueda o cambia de categoría.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory(ToolCategory.ALL)}}
                className="mt-6 text-sm font-medium text-primary-400 hover:text-primary-300 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} OmniTools Hub. Proceso local seguro & Gemini API BYOK.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;