package api.ligth.inventory.controller;

import api.ligth.inventory.domain.LightInventory;
import api.ligth.inventory.service.LightInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/lightInventory")
@RequiredArgsConstructor
public class LightInventoryController {

    private final LightInventoryService lightInventoryService;

    @GetMapping()
    ResponseEntity<List<LightInventory>> getAll() {
        List<LightInventory> all = lightInventoryService.findall();

        return ResponseEntity.ok(all);
    }

    @GetMapping("/{id}")
    ResponseEntity<Optional<LightInventory>> getById(@PathVariable Long id) {
        Optional<LightInventory> findById = lightInventoryService.findById(id);

        return ResponseEntity.ok(findById);
    }
}
