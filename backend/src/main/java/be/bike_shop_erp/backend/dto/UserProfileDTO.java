package be.bike_shop_erp.backend.dto;

import be.bike_shop_erp.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
@AllArgsConstructor
public class UserProfileDTO {
    private int id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Role role;
    private ShopBasicInfoDTO shop;
}
