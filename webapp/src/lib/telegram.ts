declare global {
  interface Window {
    Telegram: any;
  }
}

export const tg = window.Telegram?.WebApp;

export function sendData(data: any) {
  if (tg) {
    tg.sendData(JSON.stringify(data));
  } else {
    console.log('[DEV] sendData:', data);
  }
}

export function openLink(url: string) {
  if (tg) tg.openLink(url);
  else window.open(url, '_blank');
}

export function getUser() {
  return tg?.initDataUnsafe?.user;
}
