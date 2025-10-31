package be.bike_shop_erp.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// this filter intercepts all http calls and make sure the token is valid
// it is a @Component, meaning it is managed directly by Spring
// docs: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/filter/OncePerRequestFilter.html
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final AppUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain //chain of responsibility design pattern ?
    ) throws ServletException, IOException {
        System.out.println("****JwtAuthenticationFilter called****");

        final String authHeader = request.getHeader("Authorization");
        System.out.println("****Got Authorizations****");
        final String jwt;
        final String userEmail;

        // perform check before trying to obtain the token
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            // note: the filter doesn't stop the request,
            // which will continue towards the endpoint which is itself protected
            filterChain.doFilter(request, response);
            return;
        }
        System.out.println("****First check performed****");
        //get token from header
        jwt = authHeader.substring(7);
         System.out.println("****GEt token****");
         System.out.println("****GEt token****" + jwt);
        //get userEmail (userName for SpringSecurity) from token using utility class
        userEmail = jwtTokenUtil.extractUserName(jwt);
        System.out.println("****GEt username****");
        System.out.println("****" + userEmail  + "****");
        // if there is an email in the token and the user is not (yet) authenticated
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
            System.out.println("there is an email in the token and the user is not (yet) authenticated");
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            if(jwtTokenUtil.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                // add details about the request (request metadata)
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
