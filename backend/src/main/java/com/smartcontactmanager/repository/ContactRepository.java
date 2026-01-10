package com.smartcontactmanager.repository;

import com.smartcontactmanager.entity.Contact;
import com.smartcontactmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Contact entity
 */
@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    List<Contact> findByUser(User user);
    
    List<Contact> findByUserId(Long userId);
    
    @Query("SELECT c FROM Contact c WHERE c.user = :user AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%'))")
    List<Contact> searchContacts(@Param("user") User user, @Param("keyword") String keyword);
}
