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

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
        System.out.println("getting authorization from request header...");
        final String jwt;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            System.out.println("no auth header found...");
            return;
        }
        jwt = authHeader.substring(7);
        System.out.println("token found in header: " + jwt);
        var storedToken = tokenRepository.findByToken(jwt)
                .orElse(null);
        if (storedToken != null) {
            System.out.println("token found...");
            //storedToken.setExpired(true);
            //storedToken.setRevoked(true);
            //System.out.println("token revoked...");
            tokenRepository.delete(storedToken);
            System.out.println("token deleted...");
            SecurityContextHolder.clearContext();
        }
    }
}
