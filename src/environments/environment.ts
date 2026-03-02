export const environment = {
  production: true,
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'https://drf-api-stock-ai.onrender.com/api',
  authType: 'Bearer',
  tokenField: 'access'
};