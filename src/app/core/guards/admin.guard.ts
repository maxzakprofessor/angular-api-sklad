import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const currentUser = localStorage.getItem('username');

  // РАЗРЕШАЕМ ДОСТУП: 
  // 1. Глобальному админу
  // 2. Твоему новому SaaS-директору
  if (currentUser === 'admin' || currentUser === 'm.zakiryanov70') {
    return true;
  }

  // Если это обычный сотрудник (worker), блокируем
  console.warn('🔒 Unauthorized access attempt to Admin section!');
  return router.parseUrl('/dashboard');
};
