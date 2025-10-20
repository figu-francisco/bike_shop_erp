package be.bike_shop_erp.backend.repository;

import be.bike_shop_erp.backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String refreshToken);

    List<RefreshToken> findByAppUser_Email(String email);
}
