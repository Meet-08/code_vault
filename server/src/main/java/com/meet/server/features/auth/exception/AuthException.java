package com.meet.server.features.auth.exception;

import org.springframework.http.HttpStatus;

public class AuthException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus status;

    public AuthException(String message) {
        super(message);
        this.errorCode = "AUTH_ERROR";
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public AuthException(String errorCode, String message, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public AuthException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "AUTH_ERROR";
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
