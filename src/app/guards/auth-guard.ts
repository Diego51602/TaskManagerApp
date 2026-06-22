import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Guard que protege rutas que requieren autenticación
// Si el usuario no tiene token, lo redirige al login
// Es el equivalente del [Authorize] del backend pero en el frontend
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // Usuario autenticado, permite el acceso
    return true;
  }

  // Usuario no autenticado, redirige al login
  router.navigate(['/login']);
  return false;
};