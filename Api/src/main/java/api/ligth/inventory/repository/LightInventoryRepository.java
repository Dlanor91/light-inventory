package api.ligth.inventory.repository;

import api.ligth.inventory.domain.LightInventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LightInventoryRepository extends JpaRepository<LightInventory, Long> {
}
