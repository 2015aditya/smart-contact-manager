package com.smartcontactmanager.service;

import com.smartcontactmanager.dto.ContactDTO;
import com.smartcontactmanager.entity.Contact;
import com.smartcontactmanager.entity.User;
import com.smartcontactmanager.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Contact operations
 */
@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserService userService;

    /**
     * Convert Contact entity to DTO
     */
    private ContactDTO convertToDTO(Contact contact) {
        return new ContactDTO(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getDescription()
        );
    }

    /**
     * Convert DTO to Contact entity
     */
    private Contact convertToEntity(ContactDTO contactDTO, User user) {
        Contact contact = new Contact();
        contact.setName(contactDTO.getName());
        contact.setEmail(contactDTO.getEmail());
        contact.setPhone(contactDTO.getPhone());
        contact.setDescription(contactDTO.getDescription());
        contact.setUser(user);
        return contact;
    }

    /**
     * Create a new contact
     */
    public ContactDTO createContact(ContactDTO contactDTO, Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact contact = convertToEntity(contactDTO, user);
        contact = contactRepository.save(contact);
        return convertToDTO(contact);
    }

    /**
     * Update an existing contact
     */
    public ContactDTO updateContact(Long contactId, ContactDTO contactDTO, Long userId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Check if contact belongs to user
        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Contact does not belong to user");
        }

        contact.setName(contactDTO.getName());
        contact.setEmail(contactDTO.getEmail());
        contact.setPhone(contactDTO.getPhone());
        contact.setDescription(contactDTO.getDescription());

        contact = contactRepository.save(contact);
        return convertToDTO(contact);
    }

    /**
     * Delete a contact
     */
    public void deleteContact(Long contactId, Long userId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Check if contact belongs to user
        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Contact does not belong to user");
        }

        contactRepository.delete(contact);
    }

    /**
     * Get all contacts for a user
     */
    public List<ContactDTO> getAllContacts(Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> contacts = contactRepository.findByUser(user);
        return contacts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search contacts by keyword
     */
    public List<ContactDTO> searchContacts(Long userId, String keyword) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> contacts = contactRepository.searchContacts(user, keyword);
        return contacts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all contacts for a user (for admin)
     */
    public List<ContactDTO> getAllContactsByUserId(Long userId) {
        List<Contact> contacts = contactRepository.findByUserId(userId);
        return contacts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user ID by email (helper method)
     */
    public Long getUserIdByEmail(String email) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
