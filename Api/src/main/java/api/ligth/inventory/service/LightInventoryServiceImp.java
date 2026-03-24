package api.ligth.inventory.service;

import api.ligth.inventory.domain.LightInventory;
import api.ligth.inventory.dto.LightInventoryResponse;
import api.ligth.inventory.dto.LightInventoryUpsertRequest;
import api.ligth.inventory.repository.LightInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LightInventoryServiceImp implements LightInventoryService {

    private final LightInventoryRepository lightInventoryRepository;

    @Override
    public List<LightInventory> findall() {
        return lightInventoryRepository.findAll();
    }

    @Override
    public Optional<LightInventory> findById(Long id) {
        return lightInventoryRepository.findById(id);
    }

    @Override
    public LightInventoryResponse created(LightInventoryUpsertRequest request) {
        return null;
    }

    @Override
    public LightInventoryResponse update(LightInventoryUpsertRequest request, Long id) {
        return null;
    }
}
