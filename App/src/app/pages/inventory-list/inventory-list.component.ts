import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { LightInventoryResponse } from '../../models/light-inventory.model';
import { LightInventoryService } from '../../services/light-inventory.service';
import {
  InventoryDetailDialogComponent,
  InventoryDetailDialogData
} from '../../dialogs/inventory-detail-dialog.component';
import {
  ConfirmDeleteDialogComponent,
  ConfirmDeleteDialogData
} from '../../dialogs/confirm-delete-dialog.component';

@Component({
  selector: 'app-inventory-list',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent implements OnInit, OnDestroy {
  private readonly service = inject(LightInventoryService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly breakpoint = inject(BreakpointObserver);
  private layoutSub?: Subscription;

  /** ~425px: 26.5625rem a 16px de referencia */
  private readonly compactQuery = '(max-width: 26.5625rem)';

  isLoading = false;
  compactLayout = false;
  items: LightInventoryResponse[] = [];
  readonly displayedColumns: string[] = ['producto', 'cantidad', 'acciones'];

  ngOnInit(): void {
    this.layoutSub = this.breakpoint.observe(this.compactQuery).subscribe((state) => {
      this.compactLayout = state.matches;
    });
    void this.loadItems();
  }

  ngOnDestroy(): void {
    this.layoutSub?.unsubscribe();
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

  trackById(index: number, item: LightInventoryResponse): number {
    return item.id ?? index;
  }

  verMas(item: LightInventoryResponse): void {
    const data: InventoryDetailDialogData = { item };
    this.dialog.open(InventoryDetailDialogComponent, {
      data,
      width: 'min(40rem, 94vw)',
      maxHeight: '90vh',
      autoFocus: 'dialog',
      panelClass: 'inventory-detail-panel'
    });
  }

  confirmDelete(item: LightInventoryResponse): void {
    const data: ConfirmDeleteDialogData = { nombre: item.nombre };
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data,
      width: 'min(28rem, 94vw)',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (!confirmed) {
        return;
      }
      try {
        await this.service.delete(item.id);
        await this.loadItems();
        this.snackBar.open('Registro eliminado.', 'Cerrar', { duration: 2500 });
      } catch {
        this.snackBar.open('No se pudo eliminar el registro.', 'Cerrar', { duration: 3500 });
      }
    });
  }
}
