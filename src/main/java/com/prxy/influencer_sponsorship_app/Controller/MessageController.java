package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.DTO.ConversationSummary;
import com.prxy.influencer_sponsorship_app.DTO.MessageRequest;
import com.prxy.influencer_sponsorship_app.DTO.MessageResponse;
import com.prxy.influencer_sponsorship_app.Service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.prxy.influencer_sponsorship_app.Constant.ApiPath.BASE_PATH;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_PATH + "/messages")
public class MessageController {

    private final MessageService messageService;

    /**
     * GET /messages/conversation?brandId=1&influencerId=2&readerRole=BRAND
     * Returns full message history and marks incoming messages as read.
     */
    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @RequestParam int brandId,
            @RequestParam int influencerId,
            @RequestParam String readerRole) {
        return ResponseEntity.ok(messageService.getConversation(brandId, influencerId, readerRole));
    }

    /**
     * GET /messages/conversations?role=BRAND&profileId=1
     * Returns conversation list (inbox) for a user.
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummary>> getConversations(
            @RequestParam String role,
            @RequestParam int profileId) {
        List<ConversationSummary> result = role.equalsIgnoreCase("BRAND")
                ? messageService.getConversationsForBrand(profileId)
                : messageService.getConversationsForInfluencer(profileId);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /messages — send a message
     */
    @PostMapping
    public ResponseEntity<MessageResponse> send(@Valid @RequestBody MessageRequest request) {
        return new ResponseEntity<>(messageService.send(request), HttpStatus.CREATED);
    }
}
