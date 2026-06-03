"use client";

import React, { useState, useCallback } from 'react';
import { Shield, Database, Server, CheckCircle2 } from 'lucide-react';

export default function GuildMissions() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const handleComplete = useCallback((questId: string) => {
    setCompletedQuests(prev => [...prev, questId]);
  }, []);

  return (
    <div className="w-full max-w-2xl bg-[#0e0d10]/90 backdrop-blur-md p-6 rounded-none border-l-4 border-l-[#f5c400] border-t border-r border-b border-white/10 text-stone-200 font-sans shadow-2xl relative overflow-hidden group transition-all duration-500 ease-out">
      
      {/* Background Screentone Effect (Anime UI) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f5c400 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <header className="flex items-center gap-3 mb-8 relative z-10">
        <Shield className="w-8 h-8 text-[#f5c400]" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase" style={{ letterSpacing: '0.1em' }}>Painel Tático: Missões</h1>
          <p className="text-sm text-stone-400">Ordens diretas da Guilda. Complete para avançar o Arco.</p>
        </div>
      </header>
      
      <div className="flex flex-col gap-4 relative z-10">
        {/* Quest 1 */}
        <div className={`flex items-center justify-between border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] ${completedQuests.includes('q1') ? 'opacity-50 grayscale' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="bg-[#f5c400]/20 p-2 rounded-sm">
              <Database className="w-5 h-5 text-[#f5c400]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#f5c400] font-bold uppercase tracking-widest mb-1">Quest 01</span>
              <span className="text-base text-white text-wrap pretty">Backup Neural do Grimório (DB)</span>
            </div>
          </div>
          <button 
            disabled={completedQuests.includes('q1')}
            onClick={() => handleComplete('q1')}
            className="flex items-center gap-2 bg-transparent border border-[#f5c400] text-[#f5c400] px-4 py-2 hover:bg-[#f5c400] hover:text-black transition-colors duration-300 font-bold uppercase text-sm disabled:border-stone-600 disabled:text-stone-600 disabled:bg-transparent"
          >
            {completedQuests.includes('q1') ? <CheckCircle2 className="w-4 h-4" /> : 'Executar'}
          </button>
        </div>

        {/* Quest 2 */}
        <div className={`flex items-center justify-between border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] ${completedQuests.includes('q2') ? 'opacity-50 grayscale' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="bg-[#f5c400]/20 p-2 rounded-sm">
              <Server className="w-5 h-5 text-[#f5c400]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#f5c400] font-bold uppercase tracking-widest mb-1">Quest 02</span>
              <span className="text-base text-white text-wrap pretty">Atualizar Conexão do Servidor Central</span>
            </div>
          </div>
          <button 
            disabled={completedQuests.includes('q2')}
            onClick={() => handleComplete('q2')}
            className="flex items-center gap-2 bg-transparent border border-[#f5c400] text-[#f5c400] px-4 py-2 hover:bg-[#f5c400] hover:text-black transition-colors duration-300 font-bold uppercase text-sm disabled:border-stone-600 disabled:text-stone-600 disabled:bg-transparent"
          >
            {completedQuests.includes('q2') ? <CheckCircle2 className="w-4 h-4" /> : 'Executar'}
          </button>
        </div>
      </div>
    </div>
  )
}
