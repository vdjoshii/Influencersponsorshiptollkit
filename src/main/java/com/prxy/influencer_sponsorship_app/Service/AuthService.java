package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.AuthResponse;
import com.prxy.influencer_sponsorship_app.DTO.LoginRequest;
import com.prxy.influencer_sponsorship_app.DTO.RegisterRequest;
import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Model.User;
import com.prxy.influencer_sponsorship_app.Repository.BrandRepo;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import com.prxy.influencer_sponsorship_app.Repository.UserRepo;
import com.prxy.influencer_sponsorship_app.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final BrandRepo brandRepo;
    private final InfluencerRepo influencerRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("An account with this email already exists");
        }

        String role = req.getRole().toUpperCase();
        User.UserBuilder userBuilder = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(role);

        String name;
        int profileId;

        if (role.equals("BRAND")) {
            if (req.getBrandName() == null || req.getMarketingBudget() == null) {
                throw new RuntimeException("Brand name and marketing budget are required");
            }
            Brand brand = brandRepo.save(Brand.builder()
                    .name(req.getBrandName())
                    .marketingBudget(req.getMarketingBudget())
                    .build());
            userBuilder.brand(brand);
            name = brand.getName();
            profileId = brand.getId();
        } else if (role.equals("INFLUENCER")) {
            if (req.getInfluencerName() == null || req.getPlatform() == null || req.getFollowers() == null) {
                throw new RuntimeException("Influencer name, platform, and followers are required");
            }
            Influencer influencer = influencerRepo.save(Influencer.builder()
                    .name(req.getInfluencerName())
                    .platform(req.getPlatform())
                    .followers(req.getFollowers())
                    .totalEarnings(0.0)
                    .build());
            userBuilder.influencer(influencer);
            name = influencer.getName();
            profileId = influencer.getId();
        } else {
            throw new RuntimeException("Role must be BRAND or INFLUENCER");
        }

        userRepo.save(userBuilder.build());

        String token = jwtUtil.generateToken(req.getEmail(), role, profileId);
        return AuthResponse.builder()
                .token(token)
                .role(role)
                .email(req.getEmail())
                .profileId(profileId)
                .name(name)
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        int profileId;
        String name;

        if (user.getRole().equals("BRAND")) {
            profileId = user.getBrand().getId();
            name = user.getBrand().getName();
        } else {
            profileId = user.getInfluencer().getId();
            name = user.getInfluencer().getName();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), profileId);
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .email(user.getEmail())
                .profileId(profileId)
                .name(name)
                .build();
    }
}