package be.bike_shop_erp.backend.security;

import be.bike_shop_erp.backend.repository.RefreshTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final RefreshTokenRepository tokenRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
    
        final String jwt;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        jwt = authHeader.substring(7);
        var userEmail = jwtTokenUtil.extractUserName(jwt);

        //TODO: check why authentication is null
        //AppUserDetails appUserDetails = (AppUserDetails) authentication.getPrincipal(); 
        //AppUser appUser = appUserDetails.getAppUser();
        //var storedToken = tokenRepository.findByToken(jwt)

        var storedTokens = tokenRepository.findByAppUser_Email(userEmail);

        if (!storedTokens.isEmpty()) {
            tokenRepository.deleteAll(storedTokens);
            SecurityContextHolder.clearContext();
        }
    }
}
