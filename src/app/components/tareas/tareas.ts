import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TareasService, Tarea } from '../../services/tareas';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tareas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css'
})
export class TareasComponent implements OnInit {
  tareas: Tarea[] = [];
  nuevaTarea: Tarea = { titulo: '', descripcion: '', completada: false };
  loading = false;

  constructor(
    private tareasService: TareasService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareasService.getTareas().subscribe({
      next: (tareas) => {
        this.tareas = tareas;
        this.cdr.markForCheck();
      },
      error: () => this.snackBar.open('Error al cargar tareas', 'Cerrar', { duration: 3000 })
    });
  }

  crearTarea() {
    if (!this.nuevaTarea.titulo.trim()) return;
    this.loading = true;
    this.tareasService.crearTarea(this.nuevaTarea).subscribe({
      next: (tarea) => {
        this.tareas = [tarea, ...this.tareas];
        this.nuevaTarea = { titulo: '', descripcion: '', completada: false };
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open('Tarea creada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open('Error al crear tarea', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleCompletada(tarea: Tarea) {
    tarea.completada = !tarea.completada;
    this.tareasService.actualizarTarea(tarea.id!, tarea).subscribe({
      next: () => this.cdr.markForCheck(),
      error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
    });
  }

  eliminarTarea(id: number) {
    this.tareasService.eliminarTarea(id).subscribe({
      next: () => {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.cdr.markForCheck();
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }

  logout() {
    this.authService.logout();
  }
}