import { create } from "zustand";
import instance from "../utils/axios";

export const useSiteStore = create((set) => ({
  siteData: null,
  isSiteDataLoading: false,
  fetchSiteData: async () => {
    set({ isSiteDataLoading: true });
    try {
      const res = await instance.get("/sitedata");
      set({ siteData: res.data });
    } catch (err) {
      console.error("Gagal fetch siteData:", err);
    } finally {
      set({ isSiteDataLoading: false });
    }
  },
}));
