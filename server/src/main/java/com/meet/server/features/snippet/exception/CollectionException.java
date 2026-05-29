package com.meet.server.features.snippet.exception;

import lombok.Getter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Getter
@ToString
public class CollectionException extends RuntimeException {
    private final HttpStatus status;

    public CollectionException(String message) {
        super(message);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public CollectionException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }


}
