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
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  emailError = '';
  passwordError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private validation: ValidationService // Servicio de validaciones reutilizable
  ) {}

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

  login() {
    // Valida todos los campos antes de enviar
    const valido = this.validarEmail() && this.validarPassword();
    if (!valido) return;

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/tareas']);
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
      }
    });
  }
}