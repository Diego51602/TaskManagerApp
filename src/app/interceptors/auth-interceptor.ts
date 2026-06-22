import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor que agrega el token JWT automáticamente a cada petición HTTP
// Funciona como un guardia que revisa cada petición antes de mandarla a la API
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtiene el token guardado en localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Clona la petición y agrega el header de autorización
    // No modificamos la petición original, sino una copia
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  // Si no hay token, manda la petición sin modificar
  return next(req);
};