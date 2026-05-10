package com.aicareerverse.repository;

import com.aicareerverse.model.UserProfile;
import com.aicareerverse.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    Optional<UserProfile> findByName(String name);
    List<UserProfile> findByRole(UserRole role);
    List<UserProfile> findAllByOrderByXpDesc();
}
