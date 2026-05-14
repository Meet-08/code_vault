package com.meet.server.features.auth.service;

import com.meet.server.common.mail.MailService;
import com.meet.server.common.redis.RedisService;
import com.meet.server.features.auth.dto.request.ForgotPasswordRequest;
import com.meet.server.features.auth.dto.request.ResetPasswordRequest;
import com.meet.server.features.auth.exception.AuthException;
import com.meet.server.features.user.exception.UserException;
import com.meet.server.features.user.model.User;
import com.meet.server.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final String RESET_TOKEN_PREFIX = "password_reset";
    private static final Duration TOKEN_TTL = Duration.ofMinutes(15);
    private final UserService userService;
    private final RedisService redisService;
    private final MailService mailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void initiatePasswordReset(ForgotPasswordRequest request) {
        User user;
        try {
            user = userService.getByEmail(request.email());
        } catch (UserException e) {
            log.info("Password reset requested for non-existent email: {}", request.email());
            return;
        }

        String rawToken = generateRandomToken();
        String hashedToken = hashToken(rawToken);

        redisService.set(redisService.buildKey(RESET_TOKEN_PREFIX, hashedToken), user.getEmail(), TOKEN_TTL);

        String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
        sendResetEmail(user, resetLink);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String hashedToken = hashToken(request.token());
        String key = redisService.buildKey(RESET_TOKEN_PREFIX, hashedToken);

        String email = redisService.get(key, String.class);
        if (email == null) {
            throw new AuthException("Invalid or expired password reset token");
        }

        userService.updatePassword(email, request.newPassword());

        redisService.delete(key);
        log.info("Password reset successfully for user: {}", email);
    }

    private String generateRandomToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }

    @Async("mailExecutor")
    public void sendResetEmail(User user, String resetLink) {
        Map<String, Object> variables = Map.of(
                "name", user.getName(),
                "resetLink", resetLink
        );
        mailService.sendHtmlEmail(user.getEmail(), "Reset Your Password", "password-reset-email", variables);
    }
}
