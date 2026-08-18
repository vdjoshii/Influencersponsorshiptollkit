import axiosClient from "./axiosClient";

export const offersApi = {
  getAll: (page = 0, size = 10, sort = "id") =>
    axiosClient.get("/offers", { params: { page, size, sort } }),

  create: (data) => axiosClient.post("/offers", data),

  // Note: /offers/influencer and /offers/brand endpoints have a backend bug
  // (both call getOfferById). Use getAll and filter client-side instead.

  updateStatus: (id, status) =>
    axiosClient.patch(`/offers/${id}`, { status }),
};