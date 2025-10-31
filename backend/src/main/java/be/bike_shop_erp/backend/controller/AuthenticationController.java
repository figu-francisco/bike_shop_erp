package be.bike_shop_erp.backend.controller;

import be.bike_shop_erp.backend.dto.auth.AuthenticationRequestDTO;
import be.bike_shop_erp.backend.dto.auth.AuthenticationResponseDTO;
import be.bike_shop_erp.backend.security.AuthenticationService;
import be.bike_shop_erp.backend.security.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import be.bike_shop_erp.backend.dto.auth.RegisterRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
//@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service){
        this.service = service;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(
           @Validated @RequestBody RegisterRequestDTO request
    ) {
        return service.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody AuthenticationRequestDTO request
        ) {
        System.out.println("IN AUTH CONTROLLER...");
        return service.login(request);
    }

/*     @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpServletRequest) {
        return logoutService.logout(httpServletRequest);
    }
 */
/*    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }*/


}