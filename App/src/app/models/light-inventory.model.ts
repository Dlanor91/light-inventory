export interface LightInventoryUpsertRequest {
  nombre: string;
  descripcion: string;
  cantidad: number;
  fotoBase64: string | null;
}

export interface LightInventoryResponse {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  fotoBase64: string | null;
}
