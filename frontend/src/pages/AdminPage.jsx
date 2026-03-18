import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminDashboard from "../components/Admin/AdminDashboard";
import Toast from "../components/UI/Toast";
import { adminApi } from "../services/api";

/**
 * Admin route for resume oversight and feature management.
 */
function AdminPage() {
  const [resumes, setResumes] = useState([]);
  const [configRows, setConfigRows] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [toast, setToast] = useState(null);

  const loadDashboard = async () => {
    const [resumeResponse, configResponse] = await Promise.all([adminApi.listResumes(), adminApi.getConfig()]);
    setResumes(resumeResponse.data);
    setConfigRows(configResponse.data);
  };

  useEffect(() => {
    loadDashboard().catch(() => {
      setToast({ type: "error", message: "Unable to load admin data." });
    });
  }, []);

  const handleSelectResume = async (resumeId) => {
    const response = await adminApi.getResume(resumeId);
    setSelectedResume(response.data);
  };

  const handleDeleteResume = async (resumeId) => {
    await adminApi.deleteResume(resumeId);
    setToast({ type: "success", message: "Resume deleted." });
    setSelectedResume(null);
    loadDashboard();
  };

  const handleToggleFeature = async (feature, isEnabled) => {
    await adminApi.updateConfig(feature, isEnabled);
    setToast({ type: "success", message: `${feature.replaceAll("_", " ")} updated.` });
    loadDashboard();
  };

  return (
    <div className="obsidian-shell min-h-screen px-6 py-8">
      <Toast onClose={() => setToast(null)} toast={toast} />
      <header className="mb-8 flex items-center justify-between border-b border-obsidian-border pb-6">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="display-title mt-3">Admin Dashboard</h1>
        </div>
        <Link className="editorial-button-secondary" to="/">
          Back to Builder
        </Link>
      </header>
      <AdminDashboard
        configRows={configRows}
        onDeleteResume={handleDeleteResume}
        onSelectResume={handleSelectResume}
        onToggleFeature={handleToggleFeature}
        resumes={resumes}
        selectedResume={selectedResume}
      />
    </div>
  );
}

export default AdminPage;
