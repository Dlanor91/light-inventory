import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import axios from 'axios';
import {
  LightInventoryResponse,
  LightInventoryUpsertRequest
} from './models/light-inventory.model';
import { LightInventoryService } from './services/light-inventory.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly service = inject(LightInventoryService);

  isLoading = false;
  isSaving = false;
  isConvertingPhoto = false;
  selectedPhotoLabel = 'Sin archivo seleccionado';
  items: LightInventoryResponse[] = [];

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    fotoBase64: ['', [Validators.required]]
  });

  ngOnInit(): void {
    void this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.isLoading = true;
    try {
      this.items = await this.service.getAll();
    } catch {
      this.snackBar.open('No se pudo cargar el inventario.', 'Cerrar', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isConvertingPhoto) {
      this.snackBar.open('Espera a que termine de procesarse la foto.', 'Cerrar', { duration: 2500 });
      return;
    }

    this.isSaving = true;
    try {
      const payload: LightInventoryUpsertRequest = {
        nombre: this.form.controls.nombre.value.trim(),
        descripcion: this.form.controls.descripcion.value.trim(),
        cantidad: this.form.controls.cantidad.value,
        fotoBase64: this.form.controls.fotoBase64.value || null
      };

      const created = await this.service.create(payload);
      this.items = [created, ...this.items];
      this.form.reset({ nombre: '', descripcion: '', cantidad: 1, fotoBase64: '' });
      this.selectedPhotoLabel = 'Sin archivo seleccionado';
      this.snackBar.open('Elemento guardado correctamente.', 'Cerrar', { duration: 2500 });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'No se pudo guardar el elemento.')
        : 'No se pudo guardar el elemento.';
      this.snackBar.open(message, 'Cerrar', { duration: 3500 });
    } finally {
      this.isSaving = false;
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.selectedPhotoLabel = 'Sin archivo seleccionado';
      this.form.controls.fotoBase64.setValue('');
      return;
    }

    this.selectedPhotoLabel = file.name;
    this.isConvertingPhoto = true;
    try {
      const base64 = await this.toDataUrl(file);
      this.form.controls.fotoBase64.setValue(base64);
    } catch {
      this.form.controls.fotoBase64.setValue('');
      this.snackBar.open('No se pudo convertir la foto a base64.', 'Cerrar', { duration: 3000 });
    } finally {
      this.isConvertingPhoto = false;
    }
  }

  hasError(controlName: 'nombre' | 'descripcion' | 'cantidad'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  trackById(index: number, item: LightInventoryResponse): number {
    return item.id ?? index;
  }

  private toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('No se pudo leer la foto.'));
      reader.readAsDataURL(file);
    });
  }
}
