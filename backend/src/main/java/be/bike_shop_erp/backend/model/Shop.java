package be.bike_shop_erp.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //  @ToString, @EqualsAndHashCode, @Getter / @Setter and @RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shops")
@Builder
public class Shop {
    @Id
    private int id;
    private String name;
    private String code;
    private String phoneNumber;
    private String address;
    private String email;
    //private String appointmentConfig;
    private boolean availableForAppointments;    
}
