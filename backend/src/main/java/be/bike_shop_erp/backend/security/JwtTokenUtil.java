package be.bike_shop_erp.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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

//    @Value("${application.security.jwt.expiration}")
//    private long jwtRefreshExpirationInMs; // 1 hour
//    @Value("${application.security.jwt.refresh-token.expiration}")
//    private long accessExpiration; // 7 days


    private final long jwtRefreshExpirationInMs = 60*60*1000; // 1 hour

    private final long accessExpiration = 7*24*60*60*1000;; // 7 days


    // Generate JWT without extra claims
    // pass extra claims as empty Map
    public String buildAccessToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails){
        return generateToken(extraClaims, userDetails, accessExpiration);
    }

    public String buildRefreshToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return generateToken(extraClaims, userDetails, jwtRefreshExpirationInMs);
    }


    // Generate JWT token with extra claims
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration) {

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // getUsername() returns the users email
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
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

    // extracts username from token, in my case is the user's email
    public String extractUserName(String token){
        return extractClaim(token, Claims::getSubject);
    }

    // first gets all claims, then it applies the function passed in param
    // that can be for example Claims::GetSubject, Claims::getExpiration, etc.
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token){
        return Jwts
                // factory method from io.jsonwebtoken.Jwts
                // returns an object JwtParserBuilder to
                // configure how the JWT will be parsed
                // https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/io/jsonwebtoken/Jwts.html
                // https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/io/jsonwebtoken/JwtParserBuilder.html
                .parserBuilder()

                // get signing key from token and pass it to
                // setSigningKey() to verify key
                .setSigningKey(getSignInKey())

                // finalizes the build and returns a JwtParser
                .build()

                // decode, verify and parses payload into Jws<Claim> object
                .parseClaimsJws(token)

                // extracts Claims
                // https://javadoc.io/doc/io.jsonwebtoken/jjwt-api/0.11.5/io/jsonwebtoken/Claims.html
                .getBody();
    }

    private Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(String.valueOf(secretKey));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public long getRefreshExpirationInMs() {
        return jwtRefreshExpirationInMs;
    }
}
