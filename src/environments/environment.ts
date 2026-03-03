export const environment = {
  production: true,
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'https://thundering-chantal-zakiryanov-66760eab.koyeb.app/api/',
  authType: 'Bearer',
  tokenField: 'access'
};