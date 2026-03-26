import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { LightInventoryResponse } from '../models/light-inventory.model';

export interface InventoryDetailDialogData {
  item: LightInventoryResponse;
}

@Component({
  selector: 'app-inventory-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatCardModule, MatDividerModule],
  templateUrl: './inventory-detail-dialog.component.html',
  styleUrl: './inventory-detail-dialog.component.scss'
})
export class InventoryDetailDialogComponent {
  readonly data = inject<InventoryDetailDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<InventoryDetailDialogComponent>);

  cerrar(): void {
    this.dialogRef.close();
  }
}
