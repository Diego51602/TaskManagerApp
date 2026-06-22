import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';
import { ValidationService } from '../../services/validation';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  loading = false;
  nombreError = '';
  emailError = '';
  passwordError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private validation: ValidationService // Servicio de validaciones reutilizable
  ) {}

  validarNombre(): boolean {
    this.nombreError = this.validation.validarNombre(this.nombre);
    this.cdr.markForCheck();
    return !this.nombreError;
  }

  validarEmail(): boolean {
    this.emailError = this.validation.validarEmail(this.email);
    this.cdr.markForCheck();
    return !this.emailError;
  }

  validarPassword(): boolean {
    this.passwordError = this.validation.validarPassword(this.password);
    this.cdr.markForCheck();
    return !this.passwordError;
  }

  register() {
    // Valida todos los campos antes de enviar
    const valido = this.validarNombre() && this.validarEmail() && this.validarPassword();
    if (!valido) return;

    this.loading = true;
    this.authService.register({
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.snackBar.open('¡Cuenta creada! Inicia sesión', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open(err.error?.message || 'Error al registrarse', 'Cerrar', { duration: 3000 });
      }
    });
  }
}