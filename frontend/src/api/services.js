import api from "./client";

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

// ─── Brands ──────────────────────────────────────────────
export const brandsApi = {
  getAll:   (page = 0, size = 10) => api.get("/brands", { params: { page, size, sort: "name" } }),
  getById:  (id)                  => api.get(`/brands/${id}`),
  create:   (data)                => api.post("/brands", data),
  addMarketingBudget: (id, amount) => api.patch(`/brands/${id}/marketing-budget`, { amount }),
};

// ─── Influencers ─────────────────────────────────────────
export const influencersApi = {
  getAll:   (page = 0, size = 10) => api.get("/influencers", { params: { page, size, sort: "followers" } }),
  getById:  (id)                  => api.get(`/influencers/${id}`),
  create:   (data)                => api.post("/influencers", data),
};

// ─── Offers ──────────────────────────────────────────────
export const offersApi = {
  getAll:          (page = 0, size = 10) => api.get("/offers", { params: { page, size } }),
  getByBrand:      (id, page = 0)        => api.get("/offers/brand", { params: { id, page, size: 50 } }),
  getByInfluencer: (id, page = 0)        => api.get("/offers/influencer", { params: { id, page, size: 50 } }),
  create:          (data)                => api.post("/offers", data),
  updateStatus:    (id, status)          => api.patch(`/offers/${id}`, { status }),
};

// ─── Bookmarks ───────────────────────────────────────────
export const bookmarksApi = {
  getAll:       (brandId)                    => api.get("/bookmarks", { params: { brandId } }),
  getIds:       (brandId)                    => api.get("/bookmarks/ids", { params: { brandId } }),
  toggle:       (brandId, influencerId)      => api.post("/bookmarks/toggle", null, { params: { brandId, influencerId } }),
};

// ─── Ratings ─────────────────────────────────────────────
export const ratingsApi = {
  getForInfluencer: (influencerId)  => api.get("/ratings", { params: { influencerId } }),
  upsert:           (data)          => api.post("/ratings", data),
};

// ─── Messages ────────────────────────────────────────────
export const messagesApi = {
  getConversation:  (brandId, influencerId, readerRole) =>
    api.get("/messages/conversation", { params: { brandId, influencerId, readerRole } }),
  getConversations: (role, profileId) =>
    api.get("/messages/conversations", { params: { role, profileId } }),
  send:             (data) => api.post("/messages", data),
};
