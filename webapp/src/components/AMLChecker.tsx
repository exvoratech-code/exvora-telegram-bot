import { useState } from 'react';
import { openLink } from '../lib/telegram';

export function AMLChecker() {
  const [state, setState] = useState<'idle' | 'paying' | 'paid' | 'checking' | 'result'>('idle');
  const [address, setAddress] = useState('');
  const [asset, setAsset] = useState('USDT');
  const [result, setResult] = useState<any>(null);

  const price = 0.70;

  const startPayment = () => {
    setState('paying');
    // TODO: реальный вызов /api/payments/create-aml
    setTimeout(() => {
      setState('paid');
    }, 1200);
  };

  const checkWallet = () => {
    if (!address) return alert('Введите адрес');
    setState('checking');

    // TODO: реальный вызов после оплаты
    setTimeout(() => {
      const isBad = address.toLowerCase().includes('bad');
      setResult({
        riskScore: isBad ? 87 : 12,
        riskLevel: isBad ? 'high' : 'low',
        signals: isBad ? ['High-risk exchange'] : ['Clean'],
        address,
        asset,
      });
      setState('result');
    }, 1500);
  };

  if (state === 'result' && result) {
    const safe = result.riskLevel === 'low';
    return (
      <div className="space-y-6">
        <div className={`card p-6 border-2 ${safe ? 'border-[#22c55e]' : 'border-[#ef4444]'}`}>
          <div className="font-mono text-sm text-[#888]">{result.address}</div>
          <div className={`text-6xl font-semibold tracking-[-3px] mt-4 ${safe ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            {result.riskScore}
          </div>
          <div className="text-lg font-medium mt-1">{safe ? 'Низкий риск' : 'Высокий риск'}</div>
        </div>

        <button onClick={() => { setState('idle'); setResult(null); setAddress(''); }} className="btn btn-secondary w-full">
          Проверить другой адрес
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="section-title">ПРОВЕРКА КОШЕЛЬКА НА AML</div>
        <p className="text-sm text-[#777]">Стоимость проверки — ${price}</p>
      </div>

      {state === 'idle' && (
        <button onClick={startPayment} className="btn btn-primary w-full py-4">
          Оплатить ${price} и проверить кошелёк
        </button>
      )}

      {(state === 'paying' || state === 'paid') && (
        <div className="card p-6 space-y-4">
          {state === 'paying' && <div className="text-center">Открываем оплату...</div>}

          {state === 'paid' && (
            <>
              <div className="text-[#22c55e] text-center font-medium">✓ Оплата подтверждена</div>

              <div>
                <div className="text-xs text-[#888] mb-2">Сеть</div>
                <div className="flex gap-2">
                  {['USDT', 'BTC', 'ETH', 'TON'].map(a => (
                    <button key={a} onClick={() => setAsset(a)} className={`px-4 py-1.5 rounded-lg text-sm border ${asset === a ? 'bg-[#c5a46e] text-black' : 'border-[#333]'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-[#888] mb-1">Адрес кошелька</div>
                <input className="input font-mono" placeholder="0x... или bc1..." value={address} onChange={e => setAddress(e.target.value)} />
              </div>

              <button onClick={checkWallet} className="btn btn-primary w-full">Проверить адрес</button>
            </>
          )}
        </div>
      )}

      {state === 'checking' && (
        <div className="card p-8 text-center">Проверяем через AMLBot...</div>
      )}
    </div>
  );
}
