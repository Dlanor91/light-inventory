package api.ligth.inventory.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Data
@Table(name = "LIGHT_INVENTORY")
public class LightInventory extends BaseEntity {
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "descripcion", length = 200)
    private String descripcion;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "foto_base64", nullable = false,columnDefinition = "TEXT")
    private String fotoBase64;

    @CreationTimestamp
    @Column(name = "fecha_create", nullable = false, updatable = false)
    private OffsetDateTime fechaCreate;

    @UpdateTimestamp
    @Column(name = "fecha_update")
    private OffsetDateTime fechaUpdate;
}
