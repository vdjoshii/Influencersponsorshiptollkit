package com.prxy.influencer_sponsorship_app.Repository;

import com.prxy.influencer_sponsorship_app.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {

    /** All messages in a conversation, oldest first */
    List<Message> findByBrandIdAndInfluencerIdOrderByCreatedAtAsc(int brandId, int influencerId);

    /** Unread count for a recipient */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.brand.id = :brandId AND m.influencer.id = :influencerId AND m.senderRole <> :role AND m.read = false")
    long countUnread(int brandId, int influencerId, String role);

    /** Mark all messages in a conversation as read for the given recipient role */
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.read = true WHERE m.brand.id = :brandId AND m.influencer.id = :influencerId AND m.senderRole <> :readerRole")
    void markRead(int brandId, int influencerId, String readerRole);

    /** Distinct brand IDs that have messaged a given influencer */
    @Query("SELECT DISTINCT m.brand.id FROM Message m WHERE m.influencer.id = :influencerId")
    List<Integer> findBrandIdsByInfluencerId(int influencerId);

    /** Distinct influencer IDs that a brand has messaged */
    @Query("SELECT DISTINCT m.influencer.id FROM Message m WHERE m.brand.id = :brandId")
    List<Integer> findInfluencerIdsByBrandId(int brandId);
}
