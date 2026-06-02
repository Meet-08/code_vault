package com.meet.server.features.user.service;

import com.meet.server.common.api.PageResponse;
import com.meet.server.common.util.SecurityUtils;
import com.meet.server.features.admin.dto.AdminUserResponse;
import com.meet.server.features.user.dto.request.AssignRolesRequest;
import com.meet.server.features.user.dto.response.UserResponse;
import com.meet.server.features.user.enums.UserRole;
import com.meet.server.features.user.exception.UserException;
import com.meet.server.features.user.model.User;
import com.meet.server.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @CacheEvict(value = "admin-dashboard", allEntries = true)
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
        return toResponse(Objects.requireNonNull(SecurityUtils.getCurrentUser()));
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

    public PageResponse<AdminUserResponse> getUsers(String q, Pageable pageable) {
        var userPage = userRepository.search(q, pageable);
        var user = userPage.getContent().stream()
                .map(this::toAdminResponse)
                .toList();
        return new PageResponse<>(
                user,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    public Long countUsers() {
        return userRepository.count();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toList())
        );
    }

    private AdminUserResponse toAdminResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
