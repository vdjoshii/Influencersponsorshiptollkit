package com.prxy.influencer_sponsorship_app.Exception;

import com.prxy.influencer_sponsorship_app.DTO.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BrandNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleBrandNotFound(BrandNotFoundException ex) {
        return error(ex.getMessage(), "Brand Not Found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InfluencerNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleInfluencerNotFound(InfluencerNotFoundException ex) {
        return error(ex.getMessage(), "Influencer Not Found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OfferNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleOfferNotFound(OfferNotFoundException ex) {
        return error(ex.getMessage(), "Offer Not Found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InsufficientResourcesException.class)
    public ResponseEntity<ApiErrorResponse> handleInsufficientResources(InsufficientResourcesException ex) {
        return error(ex.getMessage(), "Insufficient Budget", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidOfferStateException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidOfferState(InvalidOfferStateException ex) {
        return error(ex.getMessage(), "Invalid Offer State", HttpStatus.BAD_REQUEST);
    }

    // Catches auth errors (wrong password, email exists, etc.)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(RuntimeException ex) {
        return error(ex.getMessage(), "Request Failed", HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ApiErrorResponse> error(String message, String details, HttpStatus status) {
        ApiErrorResponse body = new ApiErrorResponse(LocalDateTime.now(), message, details);
        return new ResponseEntity<>(body, status);
    }
}