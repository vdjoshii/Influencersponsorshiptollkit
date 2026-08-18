package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.DTO.AuthResponse;
import com.prxy.influencer_sponsorship_app.DTO.LoginRequest;
import com.prxy.influencer_sponsorship_app.DTO.RegisterRequest;
import com.prxy.influencer_sponsorship_app.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.prxy.influencer_sponsorship_app.Constant.ApiPath.BASE_PATH;

@RestController
@RequestMapping(BASE_PATH + "/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}