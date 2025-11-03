package be.bike_shop_erp.backend.model;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Data //  @ToString, @EqualsAndHashCode, @Getter / @Setter and @RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String firstName;

    private String lastName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne
    /* @Column(name = "shop_id", nullable = true) */
    private Shop shop;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "appUser"/* , cascade = CascadeType.ALL, orphanRemoval = true */)
    @Builder.Default
    private List<RefreshToken> refreshTokens = new ArrayList<>();

}
