import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inventario' },
  {
    path: 'inventario',
    loadComponent: () =>
      import('./pages/inventory-list/inventory-list.component').then((m) => m.InventoryListComponent)
  },
  {
    path: 'inventario/nuevo',
    loadComponent: () =>
      import('./pages/inventory-form/inventory-form.component').then((m) => m.InventoryFormComponent)
  },
  {
    path: 'inventario/editar/:id',
    loadComponent: () =>
      import('./pages/inventory-form/inventory-form.component').then((m) => m.InventoryFormComponent)
  },
  { path: '**', redirectTo: 'inventario' }
];
