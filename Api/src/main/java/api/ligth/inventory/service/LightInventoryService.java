package api.ligth.inventory.service;

import api.ligth.inventory.domain.LightInventory;
import api.ligth.inventory.dto.LightInventoryResponse;
import api.ligth.inventory.dto.LightInventoryUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface LightInventoryService {
    List<LightInventory> findall();

    Optional<LightInventory> findById(Long id);

    LightInventoryResponse created(LightInventoryUpsertRequest request);

    Optional<LightInventoryResponse> update(LightInventoryUpsertRequest request, Long id);
}
