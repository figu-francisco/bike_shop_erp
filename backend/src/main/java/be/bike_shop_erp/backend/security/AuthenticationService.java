package be.bike_shop_erp.backend.security;

import be.bike_shop_erp.backend.dto.auth.RegisterRequestDTO;
import be.bike_shop_erp.backend.dto.auth.AuthenticationRequestDTO;
import be.bike_shop_erp.backend.dto.auth.AuthenticationResponseDTO;
import be.bike_shop_erp.backend.dto.ErrorResponse;
import be.bike_shop_erp.backend.model.AppUser;
import be.bike_shop_erp.backend.model.RefreshToken;
import be.bike_shop_erp.backend.model.Role;
import be.bike_shop_erp.backend.repository.AppUserRepository;
import be.bike_shop_erp.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AppUserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final RefreshTokenRepository refreshTokenRepository;
    
    public ResponseEntity<?> register(RegisterRequestDTO request) {
        
        try{
            // Create user object
            var appUser = AppUser.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phoneNumber(request.getPhoneNumber())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.CUSTOMER) // for now...
            .build();

            // Save user object in db
            repo.save(appUser);

            // Get UserDetails object to generate the token
            var userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());

            // Generate token and refresh token
            var accessToken = jwtTokenUtil.buildAccessToken(userDetails);
            var refreshToken = jwtTokenUtil.buildRefreshToken(userDetails);
            
            // Build refresh token instance
            RefreshToken refreshTokenEntity = new RefreshToken(
                    refreshToken,
                    Date.from(Instant.now().plusMillis(jwtTokenUtil.getRefreshExpirationInMs())),
                    appUser
            );
            // Save refresh token in db
            refreshTokenRepository.save(refreshTokenEntity);

            return ResponseEntity.ok(new AuthenticationResponseDTO(accessToken, refreshToken));

        } catch (Exception ex) {
            // note : the error message is contained in an Object of type record that is automatically serialised into JSON by Spring
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Registration error: " + ex.getMessage()));
        } 
    }

    public ResponseEntity<?> login(AuthenticationRequestDTO authRequest) {
        try{
            // authenticationManager needs an instance of UsernamePasswordAuthenticationToken with the user credentials. It sets the user in an Authentication instance in the Context. It'll return an Authentication instance if successfully authenticated, or trigger an exception otherwise. 
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getEmail(),
                    authRequest.getPassword()
                )
            );

            // The Authentication contains the appUserDetails
            AppUserDetails appUserDetails = (AppUserDetails) authentication.getPrincipal(); 
            AppUser appUser = appUserDetails.getAppUser();

            // Build tokens
            String accessToken = jwtTokenUtil.buildAccessToken(appUserDetails);
            String refreshToken = jwtTokenUtil.buildRefreshToken(appUserDetails);

            // Build refresh token instance
            RefreshToken refreshTokenEntity = new RefreshToken(
                    refreshToken,
                    Date.from(Instant.now().plusMillis(jwtTokenUtil.getRefreshExpirationInMs())),
                    appUser
            );

            // save refresh token in db
            refreshTokenRepository.save(refreshTokenEntity);

            return ResponseEntity.ok(new AuthenticationResponseDTO(accessToken, refreshToken));
        } catch (Exception ex) {
            // note : the error message is contained in an Object of type record that is automatically serialised into JSON by Spring
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Invalid credentials or login error"));
        }
    }
   
}
