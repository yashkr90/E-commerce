package com.ebookstore.service;

import com.ebookstore.dto.AddressRequest;
import com.ebookstore.entity.Address;
import com.ebookstore.entity.User;
import com.ebookstore.repository.AddressRepository;
import com.ebookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .isDefault(request.getIsDefault() != null && request.getIsDefault())
                .build();
        return addressRepository.save(address);
    }
}
