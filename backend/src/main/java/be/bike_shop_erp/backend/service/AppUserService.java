package be.bike_shop_erp.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import be.bike_shop_erp.backend.dto.UserProfileDTO;
import be.bike_shop_erp.backend.dto.ErrorResponse;
import be.bike_shop_erp.backend.dto.ShopBasicInfoDTO;
import be.bike_shop_erp.backend.model.AppUser;
import be.bike_shop_erp.backend.model.Shop;
import be.bike_shop_erp.backend.repository.AppUserRepository;
import be.bike_shop_erp.backend.security.AppUserDetails;
import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class AppUserService {
    
    //private final AppUserRepository repo;
    
    
    public ResponseEntity<?> getUserProfile() {
        
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("***** BEFORE CASTING ****");
            AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
            AppUser user = userDetails.getAppUser();
            System.out.println("***** AFTER CASTING ****" + user.getEmail());


            UserProfileDTO userProfile = new UserProfileDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole(),
                getShopBasicInfoFromId(user.getShop())
            );

            System.out.println("UserProfileDTO: " + user.getEmail());

            
            return ResponseEntity.ok(userProfile);

        } catch (Exception ex) {
            // note : the error message is contained in an Object of type record that is automatically serialised into JSON by Spring
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Registration error: " + ex.getMessage()));
        } 
    }

    private ShopBasicInfoDTO getShopBasicInfoFromId(Shop shop) {
        return ShopBasicInfoDTO.builder()
            /* .id(shop.getId())
            .name(shop.getName()) */
            .id(1)
            .name("Main Shop")
            .build();
    }    
}
