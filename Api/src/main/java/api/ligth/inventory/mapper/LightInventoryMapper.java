package api.ligth.inventory.mapper;

import api.ligth.inventory.domain.LightInventory;
import api.ligth.inventory.dto.LightInventoryResponse;

public final class LightInventoryMapper {

    private LightInventoryMapper() {
    }

    public static LightInventoryResponse toResponse(LightInventory entity) {
        return new LightInventoryResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getCantidad(),
                entity.getFotoBase64()
        );
    }
}
