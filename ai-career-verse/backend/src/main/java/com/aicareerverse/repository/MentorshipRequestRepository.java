package com.aicareerverse.repository;

import com.aicareerverse.model.MentorshipRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {
    List<MentorshipRequest> findByMentorIdOrderByCreatedAtDesc(Long mentorId);
    List<MentorshipRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<MentorshipRequest> findByMentorIdAndStatus(Long mentorId, MentorshipRequest.RequestStatus status);
    List<MentorshipRequest> findByStudentIdAndMentorId(Long studentId, Long mentorId);
}
