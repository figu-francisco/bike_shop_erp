package be.bike_shop_erp.backend.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, unique = true)
    private String email;
    private String firstName;
    private String LastName;
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;
    @Column(nullable = false)
    private Role role;

}
