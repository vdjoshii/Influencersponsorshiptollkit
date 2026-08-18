package com.prxy.influencer_sponsorship_app.Service;

import com.prxy.influencer_sponsorship_app.DTO.ConversationSummary;
import com.prxy.influencer_sponsorship_app.DTO.MessageRequest;
import com.prxy.influencer_sponsorship_app.DTO.MessageResponse;
import com.prxy.influencer_sponsorship_app.Exception.BrandNotFoundException;
import com.prxy.influencer_sponsorship_app.Exception.InfluencerNotFoundException;
import com.prxy.influencer_sponsorship_app.Model.Brand;
import com.prxy.influencer_sponsorship_app.Model.Influencer;
import com.prxy.influencer_sponsorship_app.Model.Message;
import com.prxy.influencer_sponsorship_app.Repository.BrandRepo;
import com.prxy.influencer_sponsorship_app.Repository.InfluencerRepo;
import com.prxy.influencer_sponsorship_app.Repository.MessageRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepo messageRepo;
    private final BrandRepo brandRepo;
    private final InfluencerRepo influencerRepo;

    /** Send a message */
    @Transactional
    public MessageResponse send(MessageRequest req) {
        Brand brand = brandRepo.findById(req.getBrandId())
                .orElseThrow(() -> new BrandNotFoundException("Brand not found: " + req.getBrandId()));
        Influencer influencer = influencerRepo.findById(req.getInfluencerId())
                .orElseThrow(() -> new InfluencerNotFoundException("Influencer not found: " + req.getInfluencerId()));

        Message msg = messageRepo.save(Message.builder()
                .brand(brand)
                .influencer(influencer)
                .senderRole(req.getSenderRole().toUpperCase())
                .content(req.getContent().trim())
                .read(false)
                .build());

        return toResponse(msg);
    }

    /** Get full conversation history, mark messages as read for the caller */
    @Transactional
    public List<MessageResponse> getConversation(int brandId, int influencerId, String readerRole) {
        // Mark incoming messages as read
        messageRepo.markRead(brandId, influencerId, readerRole.toUpperCase());
        return messageRepo
                .findByBrandIdAndInfluencerIdOrderByCreatedAtAsc(brandId, influencerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** List all conversations for a brand */
    public List<ConversationSummary> getConversationsForBrand(int brandId) {
        return messageRepo.findInfluencerIdsByBrandId(brandId).stream()
                .map(infId -> {
                    Influencer inf = influencerRepo.findById(infId).orElse(null);
                    if (inf == null) return null;
                    List<Message> msgs = messageRepo
                            .findByBrandIdAndInfluencerIdOrderByCreatedAtAsc(brandId, infId);
                    String last = msgs.isEmpty() ? "" : msgs.get(msgs.size() - 1).getContent();
                    long unread = messageRepo.countUnread(brandId, infId, "BRAND");
                    return ConversationSummary.builder()
                            .peerId(infId)
                            .peerName(inf.getName())
                            .peerRole("INFLUENCER")
                            .lastMessage(last.length() > 60 ? last.substring(0, 60) + "…" : last)
                            .unreadCount(unread)
                            .build();
                })
                .filter(s -> s != null)
                .collect(Collectors.toList());
    }

    /** List all conversations for an influencer */
    public List<ConversationSummary> getConversationsForInfluencer(int influencerId) {
        return messageRepo.findBrandIdsByInfluencerId(influencerId).stream()
                .map(bId -> {
                    Brand brand = brandRepo.findById(bId).orElse(null);
                    if (brand == null) return null;
                    List<Message> msgs = messageRepo
                            .findByBrandIdAndInfluencerIdOrderByCreatedAtAsc(bId, influencerId);
                    String last = msgs.isEmpty() ? "" : msgs.get(msgs.size() - 1).getContent();
                    long unread = messageRepo.countUnread(bId, influencerId, "INFLUENCER");
                    return ConversationSummary.builder()
                            .peerId(bId)
                            .peerName(brand.getName())
                            .peerRole("BRAND")
                            .lastMessage(last.length() > 60 ? last.substring(0, 60) + "…" : last)
                            .unreadCount(unread)
                            .build();
                })
                .filter(s -> s != null)
                .collect(Collectors.toList());
    }

    private MessageResponse toResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .brandId(m.getBrand().getId())
                .brandName(m.getBrand().getName())
                .influencerId(m.getInfluencer().getId())
                .influencerName(m.getInfluencer().getName())
                .senderRole(m.getSenderRole())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .read(m.isRead())
                .build();
    }
}
