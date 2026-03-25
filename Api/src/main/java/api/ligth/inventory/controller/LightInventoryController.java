package api.ligth.inventory.controller;

import api.ligth.inventory.dto.LightInventoryResponse;
import api.ligth.inventory.dto.LightInventoryUpsertRequest;
import api.ligth.inventory.mapper.LightInventoryMapper;
import api.ligth.inventory.service.LightInventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/lightInventory")
@RequiredArgsConstructor
public class LightInventoryController {

    private final LightInventoryService lightInventoryService;

    @GetMapping
    ResponseEntity<List<LightInventoryResponse>> getAll() {
        List<LightInventoryResponse> list = lightInventoryService.findall().stream()
                .map(LightInventoryMapper::toResponse)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    ResponseEntity<LightInventoryResponse> getById(@PathVariable Long id) {
        return lightInventoryService.findById(id)
                .map(LightInventoryMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    ResponseEntity<LightInventoryResponse> create(@Valid @RequestBody LightInventoryUpsertRequest request) {
        LightInventoryResponse created = lightInventoryService.created(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    ResponseEntity<LightInventoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LightInventoryUpsertRequest request) {
        return lightInventoryService.update(request, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
