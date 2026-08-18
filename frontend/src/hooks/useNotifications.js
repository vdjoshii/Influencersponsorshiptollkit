import { useState, useEffect, useCallback, useRef } from "react";
import { offersApi } from "../api/services";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "sponsorlink_seen_offers";
const POLL_INTERVAL = 30_000; // 30 seconds

function getSeenIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

/**
 * Derives notifications from offer state changes.
 * - Brand: notified when an offer is ACCEPTED or REJECTED
 * - Influencer: notified when a new PENDING offer arrives
 */
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const seenRef = useRef(getSeenIds());

  const buildNotifications = useCallback((offers) => {
    const seen = seenRef.current;
    const notes = [];

    if (user?.role === "BRAND") {
      offers
        .filter((o) => o.status === "ACCEPTED" || o.status === "REJECTED")
        .forEach((o) => {
          const key = `offer-${o.id}-${o.status}`;
          notes.push({
            id: key,
            type: o.status === "ACCEPTED" ? "success" : "info",
            title: o.status === "ACCEPTED" ? "Offer Accepted" : "Offer Declined",
            message: `${o.influencer?.name} ${o.status === "ACCEPTED" ? "accepted" : "declined"} your ₹${o.proposedAmount?.toLocaleString("en-IN")} offer`,
            read: seen.has(key),
            offerId: o.id,
          });
        });
    } else {
      offers
        .filter((o) => o.status === "PENDING")
        .forEach((o) => {
          const key = `offer-${o.id}-PENDING`;
          notes.push({
            id: key,
            type: "info",
            title: "New Sponsorship Offer",
            message: `${o.brand?.name} sent you a ₹${o.proposedAmount?.toLocaleString("en-IN")} offer`,
            read: seen.has(key),
            offerId: o.id,
          });
        });
    }

    // Sort: unread first
    notes.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
    setNotifications(notes);
    setUnreadCount(notes.filter((n) => !n.read).length);
  }, [user]);

  const fetchOffers = useCallback(async () => {
    if (!user?.profileId) return;
    try {
      const res = user.role === "BRAND"
        ? await offersApi.getByBrand(user.profileId)
        : await offersApi.getByInfluencer(user.profileId);
      buildNotifications(res.data.content || []);
    } catch {
      // silent fail — notifications are non-critical
    }
  }, [user, buildNotifications]);

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchOffers]);

  const markAllRead = useCallback(() => {
    const allIds = new Set(notifications.map((n) => n.id));
    seenRef.current = allIds;
    saveSeenIds(allIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [notifications]);

  const markRead = useCallback((id) => {
    seenRef.current.add(id);
    saveSeenIds(seenRef.current);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  return { notifications, unreadCount, markAllRead, markRead, refresh: fetchOffers };
}
