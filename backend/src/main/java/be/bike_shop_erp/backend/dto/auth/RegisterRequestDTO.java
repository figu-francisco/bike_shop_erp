package be.bike_shop_erp.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @Email
    @NotBlank
    private String email;
    /* @Pattern(regexp="^\\+(43|32|359|385|357|420|45|372|358|33|49|30|36|354|353|39|371|423|370|352|356|31|47|48|351|40|421|386|34|46)\\d{6,}", message="Please use correct phone number format: 470 12 34 56")    */ 
    private String phoneNumber; // TODO: add dynamic validation for accepted country codes
    /* ROAM_LIKE_AT_HOME_COUNTRIES = [
            "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE",
            "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL",
            "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE"
        ] */
    private String role;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp="^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&,.])[A-Za-z\\d@$!%*?&,.]{8,}$", message = "Password must be at least 8 characters and include uppercase, lowercase, and a number.")
    private String password;
    private String passwordConfirm;
}



