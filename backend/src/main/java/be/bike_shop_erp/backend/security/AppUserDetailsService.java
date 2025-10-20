package be.bike_shop_erp.backend.security;

import be.bike_shop_erp.backend.model.AppUser;
import org.springframework.security.core.userdetails.User;
import be.bike_shop_erp.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


// this class fetches a user and passes it to a new instance of AppUserDetails
// then it returns this UserDetails
@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        AppUser user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new AppUserDetails(user);
    }

/*    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> user = userRepository.findByEmail(username);
        if (user.isPresent()) {
            var userObj = user.get(); //extracts user from the Optional
            return User.builder() // this is org.springframework.security.core.userdetails.User;
                    .username(userObj.getEmail())
                    .password(userObj.getPassword())
                    .roles(String.valueOf(userObj.getRole()))
                    .build();
        } else {
            throw new UsernameNotFoundException(username);
        }
    }*/
}
