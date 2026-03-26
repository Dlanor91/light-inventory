package api.ligth.inventory.dto;

public record LightInventoryResponse(
        Long id,
        String nombre,
        String descripcion,
        Integer cantidad,
        String fotoBase64
) {
}
