package com.example.E_CommerceBackEnd.contoller;

import com.example.E_CommerceBackEnd.dto.*;
import com.example.E_CommerceBackEnd.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/orders")
public class OrderContoller {

    @Autowired
    OrderService orderService;

    // GET /api/orders  (admin)
    @GetMapping("")
    public ResponseEntity<?> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "details", e.getMessage()));
        }
    }

    // GET /orders/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(orderService.getUserOrders(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "details", e.getMessage()));
        }
    }

    // POST /orders
    @PostMapping("")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest req) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message","Order created successfully","order", orderService.createOrder(req)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error","details", e.getMessage()));
        }
    }

    // PUT /orders/{id}  - update status
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            return ResponseEntity.ok(Map.of("message","Order updated successfully","order", orderService.updateOrderStatus(id, status)));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error","details", e.getMessage()));
        }
    }

    // DELETE /orders/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message","Order deleted successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error"));
        }
    }

    // --- Custom requests endpoints ---

    // GET all custom requests (admin)
    @GetMapping("/custom-requests")
    public ResponseEntity<?> getAllCustomRequests() {
        try {
            return ResponseEntity.ok(orderService.getAllCustomRequests());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error","details", e.getMessage()));
        }
    }

    // GET /orders/custom-requests/user/{userId}
    @GetMapping("/custom-requests/user/{userId}")
    public ResponseEntity<?> getUserCustomRequests(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(orderService.getUserCustomRequests(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error","details", e.getMessage()));
        }
    }

    // POST /orders/custom-requests  (multipart/form-data)

    @PostMapping(value = "/custom-requests", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCustomRequest(
            @ModelAttribute CustomRequestCreateRequest createRequest,
            @RequestParam("image") MultipartFile image
    ) {
        try {
            var resp = orderService.createCustomRequest(createRequest, image);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Custom request created successfully", "request", resp));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

//    @PostMapping(value = "/custom-requests", consumes = {"multipart/form-data"})
//    public ResponseEntity<?> createCustomRequest(
//            @RequestPart(required = false) CustomRequestCreateRequest createRequest,
//            @RequestPart(required = false) MultipartFile image
//    ) {
//        try {
//            if (createRequest == null) createRequest = new CustomRequestCreateRequest();
//            var resp = orderService.createCustomRequest(createRequest, image);
//            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message","Custom request created successfully","request", resp));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","File upload error","details", e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error","details", e.getMessage()));
//        }
//    }

    // PUT /orders/custom-requests/{id}
    @PutMapping("/custom-requests/{id}")
    public ResponseEntity<?> updateCustomRequest(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            var resp = orderService.updateCustomRequest(id, updates);
            return ResponseEntity.ok(Map.of("message","Custom request updated successfully","request", resp));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error"));
        }
    }

    // DELETE /orders/custom-requests/{id}
    @DeleteMapping("/custom-requests/{id}")
    public ResponseEntity<?> deleteCustomRequest(@PathVariable Integer id) {
        try {
            orderService.deleteCustomRequest(id);
            return ResponseEntity.ok(Map.of("message","Custom request deleted successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Internal server error"));
        }
    }
}
