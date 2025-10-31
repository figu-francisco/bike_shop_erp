package be.bike_shop_erp.backend.security;

import be.bike_shop_erp.backend.dto.auth.RegisterRequestDTO;
import be.bike_shop_erp.backend.dto.auth.AuthenticationRequestDTO;
import be.bike_shop_erp.backend.dto.auth.AuthenticationResponseDTO;
import be.bike_shop_erp.backend.dto.ErrorResponse;
import be.bike_shop_erp.backend.model.AppUser;
import be.bike_shop_erp.backend.model.RefreshToken;
import be.bike_shop_erp.backend.model.Role;
import be.bike_shop_erp.backend.repository.AppUserRepository;
//import be.bike_shop_erp.backend.security.AppUserDetails;
import be.bike_shop_erp.backend.repository.RefreshTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
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
import java.util.List;
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
    
    public ResponseEntity<?> register(RegisterRequestDTO request) {
        
        try{
            // create user object
            var appUser = AppUser.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phoneNumber(request.getPhoneNumber())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.CUSTOMER) // for now...
            .build();

            // Print fields to console
            /* System.out.println("User to be saved:");
            System.out.println("ID: " + appUser.getId());
            System.out.println("First Name: " + appUser.getFirstName());
            System.out.println("Last Name: " + appUser.getLastName());
            System.out.println("Email: " + appUser.getEmail());
            System.out.println("Phone: " + appUser.getPhoneNumber());
            System.out.println("Role: " + appUser.getRole()); */

            // save user object in db
            repo.save(appUser);

            // I need a UserDetails object to generate the token
            var userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
            // the role as extra claims
            Map<String, Object> extraClaims = Map.of(
                    "role", appUser.getRole() // TODO: check format, GrantedAuthority ?
            );

            // generate token and refresh token
            var accessToken = jwtTokenUtil.buildAccessToken(/* extraClaims, */ userDetails);
            var refreshToken = jwtTokenUtil.buildRefreshToken(/* extraClaims, */ userDetails);
            // build refresh token instance
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Registration error: " + ex.getMessage()));
        } 
    }

    public ResponseEntity<?> login(AuthenticationRequestDTO authRequest) {
        System.out.println("IN AUTH SERVICE...");
        try{
            // authenticationManager needs an instance of UsernamePasswordAuthenticationToken with the user credentials
            // it'll return an Authentication instance if successfully authenticated, or trigger an exception otherwise
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getEmail(),
                    authRequest.getPassword()
                )
            );

            System.out.println("EMAIL: " + authRequest.getEmail());
            System.out.println("PASSWORD: " + authRequest.getPassword());
            System.out.println(authentication.isAuthenticated() ? "AUTHENTICATED" : "NOT AUTHENTICATED");

            // the Authentication contains the appUser
            AppUserDetails appUserDetails = (AppUserDetails) authentication.getPrincipal(); 
            AppUser appUser = appUserDetails.getAppUser();
            

            System.out.println("APP USER EMAIL: " + appUserDetails.getUsername());

            // with appUser I can get the userDetails which I need to build the tokens
            //UserDetails userDetails = new AppUserDetails(appUser);

            // the role goes in a map as extra claims
            //Map<String, Object> extraClaims = Map.of(
                   // "role", authRequest.getRole() // TODO: check format, GrantedAuthority ?
            //);
            // build tokens
            String accessToken = jwtTokenUtil.buildAccessToken(/* extraClaims,  */appUserDetails);
            String refreshToken = jwtTokenUtil.buildRefreshToken(/* extraClaims,  */appUserDetails);

            System.out.println("ACCESS TOKEN: " + accessToken);
            System.out.println("REFRESH TOKEN: " + refreshToken);

            // build refresh token instance
            RefreshToken refreshTokenEntity = new RefreshToken(
                    refreshToken,
                    //Date.from(Instant.now().plusMillis(jwtTokenUtil.getRefreshExpirationInMs())),
                    Date.from(Instant.now().plusMillis(604800000)),
                    appUser
            );

            System.out.println("TOKEN : " + refreshTokenEntity.getToken());

            // save refresh token in db
            refreshTokenRepository.save(refreshTokenEntity);

            return ResponseEntity.ok(new AuthenticationResponseDTO(accessToken, refreshToken));
        } catch (Exception ex) {
            // note : the error message is contained in an Object of type record that is automatically serialised into JSON by Spring
            System.out.println("LOGIN ERROR: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Invalid credentials or login error"));
        }
    }
   
}
