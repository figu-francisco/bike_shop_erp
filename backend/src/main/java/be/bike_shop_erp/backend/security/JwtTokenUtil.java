package be.bike_shop_erp.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

// docs & tutorials:
// https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/index.html
// https://github.com/jwtk/jjwt
// https://www.youtube.com/watch?v=KxqlJblhzfI&t=4155s
// https://github.com/ali-bouali/spring-boot-3-jwt-security
// JwtTokenUtil class is a helper component that centralizes
// all the logic for creating, reading, and validating JWT tokens
@Service
public class JwtTokenUtil {
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    //TODO: externalize expiration values in application.properties
    private final long jwtRefreshExpirationInMs = 60 * 60 * 1000; // 1 hour

    private final long accessExpiration = 7 * 24 * 60 * 60 * 1000;; // 7 days

    public String buildAccessToken(
            UserDetails userDetails) {
        return generateToken(userDetails, accessExpiration);
    }

    public String buildRefreshToken(
            UserDetails userDetails) {
        return generateToken(userDetails, jwtRefreshExpirationInMs);
    }

    public String generateToken(
            UserDetails userDetails,
            long expiration) {

        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // getUsername() returns the users email
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from JWT
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extracts username from token, in my case is the user's email
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // First gets all claims, then it applies the function passed in param. That can be for example Claims::GetSubject, Claims::getExpiration, etc.
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                // Factory method from io.jsonwebtoken.Jwts returns an object JwtParserBuilder to configure how the JWT will be parsed
                // https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/io/jsonwebtoken/Jwts.html
                // https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/io/jsonwebtoken/JwtParserBuilder.html
                .parserBuilder()

                // Get signing key from token and pass it to setSigningKey() to verify key
                .setSigningKey(getSignInKey())

                // Finalizes the build and returns a JwtParser
                .build()

                // Decode, verify and parses payload into Jws<Claim> object
                .parseClaimsJws(token)

                // Extracts Claims
                // https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/io/jsonwebtoken/Claims.html
                .getBody();
    }

    private Key getSignInKey() {
        return secretKey;
    }

    public long getRefreshExpirationInMs() {
        return jwtRefreshExpirationInMs;
    }
}
