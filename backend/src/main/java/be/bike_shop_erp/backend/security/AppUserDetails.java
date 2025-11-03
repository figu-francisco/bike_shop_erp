package be.bike_shop_erp.backend.security;

import be.bike_shop_erp.backend.model.AppUser;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// UserDetails its instantiated and returned by the UserDetailsService
// it needs a user instance which is passed as argument at creation

@Getter
@RequiredArgsConstructor
public class AppUserDetails implements UserDetails {

    private final AppUser appUser;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name()));
    }

    @Override
    public String getPassword() {
        return appUser.getPassword();
    }

    @Override
    public String getUsername() {
        return appUser.getEmail(); // we use email to login
    }

    public AppUser getAppUser() {
        return appUser;
    }


}
