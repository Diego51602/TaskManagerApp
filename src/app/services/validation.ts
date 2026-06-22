import { Injectable } from '@angular/core';

// Servicio centralizado de validaciones
// Evita repetir la misma lógica en login y register
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Valida que el email tenga formato correcto
  validarEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'Ingresa un email válido (ejemplo@correo.com)';
    return '';
  }

  // Valida que la contraseña tenga mínimo 6 caracteres y una letra
  validarPassword(password: string): string {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6) return 'Mínimo 6 caracteres';
    if (!/[a-zA-Z]/.test(password)) return 'Debe contener al menos una letra';
    return '';
  }

  // Valida que el nombre no tenga símbolos raros
  validarNombre(nombre: string): string {
    if (!nombre) return 'El nombre es requerido';
    if (nombre.length < 2) return 'Mínimo 2 caracteres';
    if (nombre.length > 50) return 'Máximo 50 caracteres';
    if (/[<>{}[\]\\\/]/.test(nombre)) return 'El nombre contiene caracteres no permitidos';
    return '';
  }
}