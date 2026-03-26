import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';
import {
  LightInventoryResponse,
  LightInventoryUpsertRequest
} from '../models/light-inventory.model';

@Injectable({
  providedIn: 'root'
})
export class LightInventoryService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8096/api/lightInventory',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async getAll(): Promise<LightInventoryResponse[]> {
    const response = await this.client.get<LightInventoryResponse[]>('');
    return response.data;
  }

  async getById(id: number): Promise<LightInventoryResponse> {
    const response = await this.client.get<LightInventoryResponse>(`/${id}`);
    return response.data;
  }

  async create(payload: LightInventoryUpsertRequest): Promise<LightInventoryResponse> {
    const response = await this.client.post<LightInventoryResponse>('', payload);
    return response.data;
  }

  async update(id: number, payload: LightInventoryUpsertRequest): Promise<LightInventoryResponse> {
    const response = await this.client.put<LightInventoryResponse>(`/${id}`, payload);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete<void>(`/${id}`);
  }
}
