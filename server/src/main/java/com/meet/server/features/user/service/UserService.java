package com.meet.server.features.user.service;

import com.meet.server.common.util.SecurityUtils;
import com.meet.server.features.user.dto.request.AssignRolesRequest;
import com.meet.server.features.user.dto.request.UpdateProfileRequest;
import com.meet.server.features.user.dto.response.UserResponse;
import com.meet.server.features.user.enums.UserRole;
import com.meet.server.features.user.exception.UserException;
import com.meet.server.features.user.model.User;
import com.meet.server.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(String name, String email, String encodedPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new UserException("Email already in use");
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(encodedPassword)
                .roles(List.of(UserRole.USER))
                .build();

        return userRepository.save(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public UserResponse getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return toResponse(getByEmail(email));
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = getByEmail(SecurityUtils.getCurrentUserEmail());

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }

        if (request.email() != null && !request.email().isBlank()) {
            String nextEmail = request.email().trim();
            if (!nextEmail.equals(user.getEmail()) && userRepository.existsByEmail(nextEmail)) {
                throw new UserException("Email already in use");
            }
            user.setEmail(nextEmail);
        }

        return toResponse(userRepository.save(user));
    }

    public void updatePassword(String email, String newPassword) {
        User user = getByEmail(email);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse assignRoles(Long userId, AssignRolesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));

        if (request.roles() == null || request.roles().isEmpty()) {
            throw new UserException("At least one role is required");
        }

        user.setRoles(request.roles().stream().distinct().collect(Collectors.toList()));
        return toResponse(userRepository.save(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toList())
        );
    }
}
