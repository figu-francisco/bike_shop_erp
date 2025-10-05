package be.bike_shop_erp.backend.repository;

import be.bike_shop_erp.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
