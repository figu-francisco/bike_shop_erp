package be.bike_shop_erp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "refresh_tokens")
@Data
@NoArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private Date expiryDate;

    @Column(nullable = false)
    private boolean revoked;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser appUser;

    public RefreshToken(String token, Date expiryDate, AppUser appUser) {
        this.token = token;
        this.expiryDate = expiryDate;
        this.appUser = appUser;
    }
}
