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
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
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
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatBadgeModule
  ],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css'
})
export class TareasComponent implements OnInit {
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  nuevaTarea: Tarea = { titulo: '', descripcion: '', completada: false, categoria: 'General' };
  loading = false;
  filtroActivo = 'todas';
  editandoId: number | null = null;
  categorias = ['General', 'Trabajo', 'Personal', 'Urgente', 'Ideas'];

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
        this.aplicarFiltro();
        this.cdr.markForCheck();
      },
      error: () => this.snackBar.open('Error al cargar tareas', 'Cerrar', { duration: 3000 })
    });
  }

  aplicarFiltro(filtro?: string) {
    if (filtro) this.filtroActivo = filtro;
    if (this.filtroActivo === 'completadas') {
      this.tareasFiltradas = this.tareas.filter(t => t.completada);
    } else if (this.filtroActivo === 'pendientes') {
      this.tareasFiltradas = this.tareas.filter(t => !t.completada);
    } else {
      this.tareasFiltradas = this.tareas;
    }
    this.cdr.markForCheck();
  }

  crearTarea() {
    if (!this.nuevaTarea.titulo.trim()) return;
    this.loading = true;
    this.tareasService.crearTarea(this.nuevaTarea).subscribe({
      next: (tarea) => {
        this.tareas = [tarea, ...this.tareas];
        this.nuevaTarea = { titulo: '', descripcion: '', completada: false, categoria: 'General' };
        this.loading = false;
        this.aplicarFiltro();
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
      next: () => {
        this.aplicarFiltro();
        this.cdr.markForCheck();
      },
      error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
    });
  }

  editarTarea(tarea: Tarea) {
    this.editandoId = tarea.id!;
    this.cdr.markForCheck();
  }

  guardarEdicion(tarea: Tarea) {
    this.tareasService.actualizarTarea(tarea.id!, tarea).subscribe({
      next: () => {
        this.editandoId = null;
        this.aplicarFiltro();
        this.cdr.markForCheck();
        this.snackBar.open('Tarea actualizada', 'Cerrar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.cdr.markForCheck();
  }

  eliminarTarea(id: number) {
    this.tareasService.eliminarTarea(id).subscribe({
      next: () => {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.aplicarFiltro();
        this.cdr.markForCheck();
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }

  getCategoriaColor(categoria: string): string {
    const colores: any = {
      'General': 'primary',
      'Trabajo': 'accent',
      'Personal': 'warn',
      'Urgente': 'warn',
      'Ideas': 'primary'
    };
    return colores[categoria] || 'primary';
  }

  estaVencida(tarea: Tarea): boolean {
    if (!tarea.fechaLimite || tarea.completada) return false;
    return new Date(tarea.fechaLimite) < new Date();
  }

  logout() {
    this.authService.logout();
  }
}