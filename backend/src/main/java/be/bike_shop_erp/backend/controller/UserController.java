package be.bike_shop_erp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import be.bike_shop_erp.backend.service.AppUserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class UserController {

    private final AppUserService service;

    @PostMapping("/me")
    public ResponseEntity<?> getUserProfile() {
        return service.getUserProfile ();
    }

   
    
}
