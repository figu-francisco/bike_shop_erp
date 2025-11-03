package be.bike_shop_erp.backend.repository;

import be.bike_shop_erp.backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String refreshToken);

    List<RefreshToken> findByAppUser_Email(String email);
    
    // Bulk delete refresh tokens for a user by email. Returns the number of rows deleted.
    long deleteByAppUser_Email(String email);

    List<RefreshToken> findByAppUser_Id(Long id);
}
