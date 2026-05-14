package com.meet.server.features.auth.service;

import com.meet.server.common.config.AppConfig;
import com.meet.server.features.auth.exception.InvalidTokenException;
import com.meet.server.features.auth.model.RefreshToken;
import com.meet.server.features.auth.repository.RefreshTokenRepository;
import com.meet.server.features.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public String createRefreshToken(User user) {
        String rawToken = UUID.randomUUID().toString(); // opaque
        String hash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(Instant.now().plus(AppConfig.REFRESH_TOKEN_EXPIRY_DAYS, ChronoUnit.DAYS))
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Transactional
    public String rotateRefreshToken(String rawToken) {
        String hash = hashToken(rawToken);
        RefreshToken existing = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        // Reuse detection: already revoked = token was stolen
        if (existing.isRevoked()) {
            refreshTokenRepository.deleteAllByUser(existing.getUser());
            throw new InvalidTokenException("Refresh token reuse detected. All sessions invalidated.");
        }

        if (existing.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidTokenException("Refresh token expired");
        }

        // Revoke old token
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        // Issue new token
        return createRefreshToken(existing.getUser());
    }

    public User getUserFromToken(String rawToken) {
        String hash = hashToken(rawToken);
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));
        return token.getUser();
    }

    @Transactional
    public void revokeAllForUser(User user) {
        refreshTokenRepository.deleteAllByUser(user);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(
                    (rawToken).getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

}
