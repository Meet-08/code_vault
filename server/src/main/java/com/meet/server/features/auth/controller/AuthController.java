package com.meet.server.features.auth.controller;

import com.meet.server.common.api.ApiResponse;
import com.meet.server.common.config.AppConfig;
import com.meet.server.common.util.CookieUtil;
import com.meet.server.features.auth.dto.internal.TokenPair;
import com.meet.server.features.auth.dto.request.ForgotPasswordRequest;
import com.meet.server.features.auth.dto.request.LoginRequest;
import com.meet.server.features.auth.dto.request.RegisterRequest;
import com.meet.server.features.auth.dto.request.ResetPasswordRequest;
import com.meet.server.features.auth.dto.response.AuthResponse;
import com.meet.server.features.auth.exception.InvalidTokenException;
import com.meet.server.features.auth.service.AuthService;
import com.meet.server.features.auth.service.PasswordResetService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    private final long refreshTokenExpirySeconds = AppConfig.REFRESH_TOKEN_EXPIRY_SECONDS;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody @Valid LoginRequest request,
            HttpServletResponse response) {
        TokenPair tokens = authService.login(request);
        CookieUtil.addRefreshTokenCookie(response, tokens.refreshToken(), refreshTokenExpirySeconds);
        return ResponseEntity.ok(ApiResponse.ok("Logged in successfully", new AuthResponse(tokens.accessToken())));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @RequestBody @Valid RegisterRequest request,
            HttpServletResponse response
    ) {
        TokenPair tokens = authService.register(request);
        CookieUtil.addRefreshTokenCookie(response, tokens.refreshToken(), refreshTokenExpirySeconds);
        return ResponseEntity.created(URI.create("/api/users/me"))
                .body(ApiResponse.ok("Registered successfully", new AuthResponse(tokens.accessToken())));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(name = "refresh_token", required = false) String rawRefreshToken,
            HttpServletResponse response) {

        if (rawRefreshToken == null) {
            throw new InvalidTokenException("No refresh token provided");
        }

        TokenPair tokens = authService.refresh(rawRefreshToken);
        CookieUtil.addRefreshTokenCookie(response, tokens.refreshToken(), refreshTokenExpirySeconds);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", new AuthResponse(tokens.accessToken())));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = "refresh_token", required = false) String rawRefreshToken,
            HttpServletResponse response) {

        if (rawRefreshToken != null) {
            authService.logout(rawRefreshToken);
        }
        CookieUtil.clearRefreshTokenCookie(response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        passwordResetService.initiatePasswordReset(request);
        return ResponseEntity.ok(ApiResponse.ok("A password reset link has been sent.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully", null));
    }
}
