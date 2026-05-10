package com.aicareerverse.repository;

import com.aicareerverse.model.GamificationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GamificationEventRepository extends JpaRepository<GamificationEvent, Long> {
    List<GamificationEvent> findByUserIdOrderByTimestampDesc(Long userId);
    List<GamificationEvent> findTop20ByUserIdOrderByTimestampDesc(Long userId);
}
