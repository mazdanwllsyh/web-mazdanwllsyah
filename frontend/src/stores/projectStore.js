import { create } from "zustand";
import instance from "../utils/axios";

export const useProjectStore = create((set) => ({
  projects: [],
  isProjectsLoading: false,

  fetchProjects: async () => {
    set({ isProjectsLoading: true });
    try {
      const response = await instance.get("/projects");
      set({ projects: response.data, isProjectsLoading: false });
    } catch (error) {
      set({ isProjectsLoading: false });
    }
  },

  addProject: async (formData) => {
    try {
      const response = await instance.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        projects: [response.data, ...state.projects],
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProject: async (projectId, formData) => {
    try {
      const response = await instance.put(`/projects/${projectId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        projects: state.projects.map((item) =>
          item._id === projectId ? response.data : item,
        ),
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    try {
      await instance.delete(`/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((item) => item._id !== projectId),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
