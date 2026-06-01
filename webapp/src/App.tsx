import { useState } from 'react';
import { ExchangeForm } from './components/ExchangeForm';
import { AMLChecker } from './components/AMLChecker';

type Tab = 'about' | 'exchange' | 'aml';

export default function App() {
  const [tab, setTab] = useState<Tab>('about');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#222] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a46e] to-[#d4b88a] flex items-center justify-center">
            <span className="text-[#0a0a0a] font-bold text-lg">E</span>
          </div>
          <div>
            <div className="font-semibold tracking-tight">Exvora</div>
            <div className="text-[10px] text-[#666] -mt-0.5">Aurex • WoodCoin</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 gap-1 mt-4">
        {[
          { id: 'about', label: 'О нас' },
          { id: 'exchange', label: 'Записаться' },
          { id: 'aml', label: 'AML-проверка' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
              tab === t.id
                ? 'bg-[#c5a46e] text-[#0a0a0a]'
                : 'bg-[#111] text-[#888] border border-[#222]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-6">
        {tab === 'about' && <About />}
        {tab === 'exchange' && <ExchangeForm />}
        {tab === 'aml' && <AMLChecker />}
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs tracking-[2px] text-[#c5a46e] font-medium">PREMIUM CRYPTO EXCHANGE</div>
        <h1 className="text-4xl font-semibold tracking-[-1.5px] leading-none mt-1">
          Aurex &amp; WoodCoin<br />
          <span className="text-[#c5a46e]">без лишнего шума</span>
        </h1>
      </div>

      <p className="text-[#aaa] text-[15px]">
        Международный обмен Aurex и офис WoodCoin в Краснодаре. USDT, BTC, ETH, TON, SOL, наличные RUB/USD/EUR, OTC и персональный менеджер.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {[
          { v: '12 мин', l: 'среднее окно' },
          { v: '24/7', l: 'поддержка' },
          { v: 'OTC', l: 'крупные объёмы' },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <div className="text-2xl font-semibold text-[#c5a46e] tracking-tight">{s.v}</div>
            <div className="text-xs text-[#666] mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
