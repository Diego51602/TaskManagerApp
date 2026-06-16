import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  register() {
    this.loading = true;
    this.authService.register({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.snackBar.open('¡Cuenta creada! Inicia sesión', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.snackBar.open(err.error.message || 'Error al registrarse', 'Cerrar', { duration: 3000 });
      }
    });
  }
}