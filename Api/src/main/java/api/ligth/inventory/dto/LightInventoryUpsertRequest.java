package api.ligth.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LightInventoryUpsertRequest {
    @NotBlank(message = "El parametro nombre no puede estar vacio")
    private String nombre;

    @NotBlank(message = "El parametro descripcion no puede estar vacio")
    private String descripcion;

    @NotBlank(message = "El parametro cantidad no puede estar vacio")
    private Integer cantidad;
}
