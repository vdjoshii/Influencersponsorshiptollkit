package com.prxy.influencer_sponsorship_app.Controller;

import com.prxy.influencer_sponsorship_app.DTO.BookmarkResponse;
import com.prxy.influencer_sponsorship_app.Service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.prxy.influencer_sponsorship_app.Constant.ApiPath.BASE_PATH;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_PATH + "/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    /** GET /bookmarks?brandId=1 — list bookmarked influencers */
    @GetMapping
    public ResponseEntity<List<BookmarkResponse>> getBookmarks(@RequestParam int brandId) {
        return ResponseEntity.ok(bookmarkService.getBookmarks(brandId));
    }

    /** GET /bookmarks/ids?brandId=1 — set of bookmarked influencer IDs */
    @GetMapping("/ids")
    public ResponseEntity<Set<Integer>> getBookmarkedIds(@RequestParam int brandId) {
        return ResponseEntity.ok(bookmarkService.getBookmarkedIds(brandId));
    }

    /** POST /bookmarks/toggle — toggle bookmark, returns {bookmarked: true/false} */
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Boolean>> toggle(
            @RequestParam int brandId,
            @RequestParam int influencerId) {
        boolean result = bookmarkService.toggle(brandId, influencerId);
        return ResponseEntity.ok(Map.of("bookmarked", result));
    }
}
