package be.bike_shop_erp.backend.security;

import be.bike_shop_erp.backend.dto.auth.RegisterRequest;
import be.bike_shop_erp.backend.dto.auth.AuthenticationRequest;
import be.bike_shop_erp.backend.dto.auth.AuthenticationResponse;
import be.bike_shop_erp.backend.dto.ErrorResponse;
import be.bike_shop_erp.backend.model.AppUser;
import be.bike_shop_erp.backend.model.RefreshToken;
import be.bike_shop_erp.backend.model.Role;
import be.bike_shop_erp.backend.repository.AppUserRepository;
//import be.bike_shop_erp.backend.security.AppUserDetails;
import be.bike_shop_erp.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AppUserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final RefreshTokenRepository refreshTokenRepository;
    public AuthenticationResponse register(RegisterRequest request) {
        // create user object
        var appUser = AppUser.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER) // for now...
                .build();

        // Print fields to console
        System.out.println("User to be saved:");
        System.out.println("ID: " + appUser.getId());
        System.out.println("First Name: " + appUser.getFirstName());
        System.out.println("Last Name: " + appUser.getLastName());
        System.out.println("Email: " + appUser.getEmail());
        System.out.println("Phone: " + appUser.getPhoneNumber());
        System.out.println("Role: " + appUser.getRole());

        // save user object in db
        repo.save(appUser);

        // I need a UserDetails object to generate the token
        var userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
        // the role as extra claims
        Map<String, Object> extraClaims = Map.of(
                "role", appUser.getRole() // TODO: check format, GrantedAuthority ?
        );

        // generate token and refresh token
        var accessToken = jwtTokenUtil.buildAccessToken(extraClaims, userDetails);
        var refreshToken = jwtTokenUtil.buildRefreshToken(extraClaims, userDetails);
        // build refresh token instance
        RefreshToken refreshTokenEntity = new RefreshToken(
                refreshToken,
                Date.from(Instant.now().plusMillis(jwtTokenUtil.getRefreshExpirationInMs())),
                appUser
        );
        // save refresh token in db
        refreshTokenRepository.save(refreshTokenEntity);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public ResponseEntity<?> login(AuthenticationRequest authRequest) {
        try{
            // authenticationManager needs an instance of UsernamePasswordAuthenticationToken with the user credentials
            // it'll return an Authentication instance if successfully authenticated, or trigger an exception otherwise
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(),
                    authRequest.getPassword()));

            // the Authentication contains the appUser
            AppUser appUser = (AppUser) authentication.getPrincipal();

            // with appUser I can get the userDetails which I need to build the tokens
            UserDetails userDetails = new AppUserDetails(appUser);
            // the role goes in a map as extra claims
            Map<String, Object> extraClaims = Map.of(
                    "role", authRequest.getRole() // TODO: check format, GrantedAuthority ?
            );
            // build tokens
            String accessToken = jwtTokenUtil.buildAccessToken(extraClaims, userDetails);
            String refreshToken = jwtTokenUtil.buildRefreshToken(extraClaims, userDetails);
            // build refresh token instance
            RefreshToken refreshTokenEntity = new RefreshToken(
                    refreshToken,
                    Date.from(Instant.now().plusMillis(jwtTokenUtil.getRefreshExpirationInMs())),
                    appUser
            );
            // save refresh token in db
            refreshTokenRepository.save(refreshTokenEntity);

            return ResponseEntity.ok(new AuthenticationResponse(accessToken, refreshToken));
        } catch (Exception ex) {
            // note : the error message is contained in an Object of type record that is automatically serialised into JSON by Spring
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Invalid credentials or login error"));
        }
    }
}
