package be.bike_shop_erp.backend.repository;

import be.bike_shop_erp.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Integer> {
}
