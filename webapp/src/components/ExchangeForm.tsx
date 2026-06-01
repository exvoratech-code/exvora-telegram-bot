import { useState } from 'react';
import { sendData, getUser } from '../lib/telegram';

export function ExchangeForm() {
  const user = getUser();
  const [form, setForm] = useState({
    firstName: user?.first_name || '',
    lastName: '',
    telegramUsername: user?.username ? `@${user.username}` : '',
    country: 'Россия',
    city: 'Краснодар',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = () => {
    if (!form.firstName || !form.telegramUsername) {
      alert('Заполните Имя и Telegram');
      return;
    }

    const payload = {
      type: 'exchange_application',
      ...form,
      telegramUsername: form.telegramUsername.replace('@', ''),
    };

    sendData(payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card p-8 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <div className="text-xl font-semibold">Заявка отправлена</div>
        <p className="text-[#888] text-sm">Менеджер свяжется с вами в ближайшее время.</p>
        <button onClick={() => setSubmitted(false)} className="btn btn-secondary mt-2">
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="section-title">ЗАПИСАТЬСЯ НА ОБМЕН</div>

      <div>
        <div className="text-xs text-[#888] mb-1">Имя *</div>
        <input className="input" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
      </div>

      <div>
        <div className="text-xs text-[#888] mb-1">Фамилия (необязательно)</div>
        <input className="input" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
      </div>

      <div>
        <div className="text-xs text-[#888] mb-1">Telegram *</div>
        <input className="input" value={form.telegramUsername} onChange={e => update('telegramUsername', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[#888] mb-1">Страна *</div>
          <input className="input" value={form.country} onChange={e => update('country', e.target.value)} />
        </div>
        <div>
          <div className="text-xs text-[#888] mb-1">Город</div>
          <input className="input" value={form.city} onChange={e => update('city', e.target.value)} />
        </div>
      </div>

      <button onClick={submit} className="btn btn-primary w-full mt-4">
        Отправить заявку менеджеру
      </button>
    </div>
  );
}
