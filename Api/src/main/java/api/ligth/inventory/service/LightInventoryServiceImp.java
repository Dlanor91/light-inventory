package api.ligth.inventory.service;

import api.ligth.inventory.domain.LightInventory;
import api.ligth.inventory.dto.LightInventoryResponse;
import api.ligth.inventory.dto.LightInventoryUpsertRequest;
import api.ligth.inventory.mapper.LightInventoryMapper;
import api.ligth.inventory.repository.LightInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public LightInventoryResponse created(LightInventoryUpsertRequest request) {
        LightInventory entity = new LightInventory();
        applyRequest(entity, request);
        LightInventory saved = lightInventoryRepository.save(entity);
        return LightInventoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public Optional<LightInventoryResponse> update(LightInventoryUpsertRequest request, Long id) {
        return lightInventoryRepository.findById(id).map(entity -> {
            applyRequest(entity, request);
            return LightInventoryMapper.toResponse(lightInventoryRepository.save(entity));
        });
    }

    private static void applyRequest(LightInventory entity, LightInventoryUpsertRequest request) {
        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
        entity.setCantidad(request.getCantidad());
        entity.setFotoBase64(request.getFotoBase64());
    }

}
