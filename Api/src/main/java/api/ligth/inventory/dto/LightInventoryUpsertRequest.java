package api.ligth.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LightInventoryUpsertRequest {
    @NotBlank(message = "El parametro nombre no puede estar vacio")
    private String nombre;

    @NotBlank(message = "El parametro descripcion no puede estar vacio")
    private String descripcion;

    @NotNull(message = "El parametro cantidad no puede ser nulo")
    private Integer cantidad;

    @NotBlank(message = "El parametro foto no puede estar vacio")
    private String fotoBase64;
}
