import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import axios from 'axios';
import { LightInventoryUpsertRequest } from '../../models/light-inventory.model';
import { LightInventoryService } from '../../services/light-inventory.service';

@Component({
  selector: 'app-inventory-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.scss',
})
export class InventoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly service = inject(LightInventoryService);

  isSaving = false;
  isLoading = false;
  isConvertingPhoto = false;
  selectedPhotoLabel = 'Sin archivo seleccionado';
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    fotoBase64: ['', [Validators.required]],
  });

  get titulo(): string {
    return this.editingId != null ? 'Editar producto' : 'Nuevo producto';
  }

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = Number(idStr);
      if (!Number.isNaN(id)) {
        this.editingId = id;
        void this.cargar(id);
      }
    }
  }

  async cargar(id: number): Promise<void> {
    this.isLoading = true;
    try {
      const item = await this.service.getById(id);
      this.form.patchValue({
        nombre: item.nombre,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        fotoBase64: item.fotoBase64 ?? '',
      });
      this.selectedPhotoLabel = item.fotoBase64
        ? 'Imagen actual'
        : 'Sin archivo seleccionado';
    } catch {
      this.snackBar.open('No se pudo cargar el producto.', 'Cerrar', {
        duration: 3000,
      });
      void this.router.navigate(['/inventario']);
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
      this.snackBar.open(
        'Espera a que termine de procesarse la foto.',
        'Cerrar',
        { duration: 2500 },
      );
      return;
    }

    this.isSaving = true;
    try {
      const payload: LightInventoryUpsertRequest = {
        nombre: this.form.controls.nombre.value.trim(),
        descripcion: this.form.controls.descripcion.value.trim(),
        cantidad: this.form.controls.cantidad.value,
        fotoBase64: this.form.controls.fotoBase64.value || null,
      };

      if (this.editingId != null) {
        await this.service.update(this.editingId, payload);
        this.snackBar.open('Producto actualizado.', 'Cerrar', {
          duration: 2500,
        });
      } else {
        await this.service.create(payload);
        this.snackBar.open('Producto creado.', 'Cerrar', { duration: 2500 });
      }
      void this.router.navigate(['/inventario']);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'No se pudo guardar.')
        : 'No se pudo guardar.';
      this.snackBar.open(message, 'Cerrar', { duration: 3500 });
    } finally {
      this.isSaving = false;
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      if (this.editingId == null) {
        this.selectedPhotoLabel = 'Sin archivo seleccionado';
        this.form.controls.fotoBase64.setValue('');
      }
      return;
    }

    this.selectedPhotoLabel = file.name;
    this.isConvertingPhoto = true;
    try {
      const base64 = await this.toDataUrl(file);
      this.form.controls.fotoBase64.setValue(base64);
    } catch {
      this.snackBar.open('No se pudo convertir la foto a base64.', 'Cerrar', {
        duration: 3000,
      });
    } finally {
      this.isConvertingPhoto = false;
    }
  }

  hasError(controlName: 'nombre' | 'descripcion' | 'cantidad'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
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
