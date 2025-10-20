package be.bike_shop_erp.backend.repository;

import be.bike_shop_erp.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// this class extends JPA (Java Persistence API) for accessing, persisting, and managing
// the AppUser data between the Java objects and the relational database.

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {

    Optional<AppUser> findByEmail(String email);

}
