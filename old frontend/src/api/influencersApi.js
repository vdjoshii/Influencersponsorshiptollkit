import axiosClient from "./axiosClient";

export const influencersApi = {
  getAll: (page = 0, size = 10, sort = "followers") =>
    axiosClient.get("/influencers", { params: { page, size, sort } }),

  getById: (id) => axiosClient.get(`/influencers/${id}`),

  create: (data) => axiosClient.post("/influencers", data),
};
