import axios from "axios";

import { API_BASE_URL } from "../utils/constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const resumeApi = {
  createResume: (payload) => apiClient.post("/resumes/", payload),
  listResumes: () => apiClient.get("/resumes/"),
  getResume: (resumeId) => apiClient.get(`/resumes/${resumeId}/`),
  updateResume: (resumeId, payload) => apiClient.put(`/resumes/${resumeId}/`, payload),
  deleteResume: (resumeId) => apiClient.delete(`/resumes/${resumeId}/`),
  getSessionStatus: (resumeId) => apiClient.get(`/resumes/${resumeId}/session-status/`),
  generatePdf: (resumeId) => apiClient.post(`/resumes/${resumeId}/generate-pdf/`),
  sendEmail: (resumeId, recipientEmail) => apiClient.post(`/resumes/${resumeId}/send-email/`, { recipient_email: recipientEmail }),
  sendWhatsApp: (resumeId, phoneNumber) => apiClient.post(`/resumes/${resumeId}/send-whatsapp/`, { phone_number: phoneNumber }),
  getShareHistory: (resumeId) => apiClient.get(`/resumes/${resumeId}/share-history/`)
};

export const adminApi = {
  listResumes: () => apiClient.get("/admin/resumes/"),
  getResume: (resumeId) => apiClient.get(`/admin/resumes/${resumeId}/`),
  updateResume: (resumeId, payload) => apiClient.put(`/admin/resumes/${resumeId}/`, payload),
  deleteResume: (resumeId) => apiClient.delete(`/admin/resumes/${resumeId}/`),
  getActivityLogs: () => apiClient.get("/admin/activity-logs/"),
  getConfig: () => apiClient.get("/admin/config/"),
  updateConfig: (feature, isEnabled) => apiClient.put(`/admin/config/${feature}/`, { is_enabled: isEnabled })
};

export default apiClient;
