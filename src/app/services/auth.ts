import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Servicio que maneja la autenticación del usuario
// Guarda y elimina el token JWT en localStorage
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de la API de autenticación
  private apiUrl = 'https://taskmanagerapi-production-b2f6.up.railway.app/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Registra un nuevo usuario
  register(data: { nombre: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Hace login y guarda el token JWT en localStorage
  login(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  // Elimina el token y redirige al login
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Verifica si el usuario tiene sesión activa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}