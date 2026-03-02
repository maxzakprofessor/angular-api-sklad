export const environment = {
  production: true,
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'https://mzakiryanovgmailcom.pythonanywhere.com/api',
  authType: 'Bearer',
  tokenField: 'access'
};