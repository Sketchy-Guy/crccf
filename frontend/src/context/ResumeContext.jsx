import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { resumeApi } from "../services/api";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

const defaultResume = {
  full_name: "",
  email: "",
  phone: "",
  dob: "",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ degree: "", institution: "", year: "", grade: "" }],
  skills: [],
  projects: [{ title: "", tech_stack: "", description: "", link: "" }],
  linkedin: "",
  github: "",
  location: ""
};

const ResumeContext = createContext(null);

/**
 * Shared resume state, persistence helpers, API actions, and UI status.
 */
export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(defaultResume);
  const [resumeId, setResumeId] = useState(localStorage.getItem(LOCAL_STORAGE_KEYS.resumeId) || "");
  const [featureConfig, setFeatureConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastEdited, setLastEdited] = useState("");
  const [toast, setToast] = useState(null);
  const [pdfMeta, setPdfMeta] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      return;
    }

    setIsLoading(true);
    resumeApi
      .getResume(resumeId)
      .then(({ data }) => {
        setResumeData((previous) => ({
          ...previous,
          ...data
        }));
        setFeatureConfig(data.feature_config || {});
        setLastEdited(data.updated_at || "");
      })
      .catch(() => {
        setToast({ type: "error", message: "Unable to load the saved resume." });
      })
      .finally(() => setIsLoading(false));
  }, [resumeId]);

  const touchLastEdited = () => {
    setLastEdited(new Date().toISOString());
  };

  const updateResumeField = (fieldName, value) => {
    setResumeData((previous) => ({ ...previous, [fieldName]: value }));
    touchLastEdited();
  };

  const updateCollectionItem = (fieldName, index, key, value) => {
    setResumeData((previous) => {
      const nextItems = [...previous[fieldName]];
      nextItems[index] = { ...nextItems[index], [key]: value };
      return { ...previous, [fieldName]: nextItems };
    });
    touchLastEdited();
  };

  const addCollectionItem = (fieldName, template) => {
    setResumeData((previous) => ({ ...previous, [fieldName]: [...previous[fieldName], template] }));
    touchLastEdited();
  };

  const removeCollectionItem = (fieldName, index) => {
    setResumeData((previous) => ({
      ...previous,
      [fieldName]: previous[fieldName].filter((_, itemIndex) => itemIndex !== index)
    }));
    touchLastEdited();
  };

  const createOrUpdateResume = async () => {
    setIsLoading(true);
    const payload = {
      full_name: resumeData.full_name,
      email: resumeData.email,
      phone: resumeData.phone,
      dob: resumeData.dob,
      summary: resumeData.summary,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: resumeData.skills,
      projects: resumeData.projects
    };

    try {
      const response = resumeId
        ? await resumeApi.updateResume(resumeId, payload)
        : await resumeApi.createResume(payload);
      setResumeId(response.data.resume_id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.resumeId, response.data.resume_id);
      if (!localStorage.getItem(LOCAL_STORAGE_KEYS.sessionStartedAt)) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.sessionStartedAt, new Date().toISOString());
      }
      setFeatureConfig(response.data.feature_config || {});
      setToast({ type: "success", message: "Resume saved successfully." });
      return response.data;
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.detail || "Unable to save the resume."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      resumeData,
      setResumeData,
      resumeId,
      setResumeId,
      featureConfig,
      setFeatureConfig,
      isLoading,
      lastEdited,
      toast,
      setToast,
      pdfMeta,
      setPdfMeta,
      updateResumeField,
      updateCollectionItem,
      addCollectionItem,
      removeCollectionItem,
      createOrUpdateResume
    }),
    [featureConfig, isLoading, lastEdited, pdfMeta, resumeData, resumeId, toast]
  );

  return <ResumeContext.Provider value={contextValue}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  return useContext(ResumeContext);
}
