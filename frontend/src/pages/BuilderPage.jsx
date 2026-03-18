import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import AnalyticsPanel from "../components/Analytics/AnalyticsPanel";
import EducationForm from "../components/Builder/EducationForm";
import ExperienceForm from "../components/Builder/ExperienceForm";
import PersonalInfoForm from "../components/Builder/PersonalInfoForm";
import ProjectsForm from "../components/Builder/ProjectsForm";
import SkillsForm from "../components/Builder/SkillsForm";
import SummaryForm from "../components/Builder/SummaryForm";
import ResumePreview from "../components/Preview/ResumePreview";
import Modal from "../components/UI/Modal";
import Timer from "../components/UI/Timer";
import Toast from "../components/UI/Toast";
import { useResume } from "../context/ResumeContext";
import { adminApi, resumeApi } from "../services/api";
import { STEP_TITLES } from "../utils/constants";

const formComponents = [PersonalInfoForm, SummaryForm, ExperienceForm, EducationForm, SkillsForm, ProjectsForm];

/**
 * Main builder page with guided steps, live preview, timer, and action bar.
 */
function BuilderPage() {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const {
    resumeData,
    resumeId,
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
  } = useResume();

  const ActiveForm = formComponents[activeStep];
  const handlePrint = useReactToPrint({
    contentRef: previewRef
  });

  const formattedLastEdited = useMemo(() => {
    if (!lastEdited) {
      return "Not saved yet";
    }
    return new Date(lastEdited).toLocaleString("en-IN", {
      dateStyle: "long",
      timeStyle: "short"
    });
  }, [lastEdited]);

  const formProps = {
    resumeData,
    updateResumeField,
    updateCollectionItem,
    addCollectionItem,
    removeCollectionItem
  };

  const handleGeneratePdf = async () => {
    try {
      const savedResume = await createOrUpdateResume();
      const response = await resumeApi.generatePdf(savedResume.resume_id);
      setPdfMeta(response.data);
      setIsPasswordModalOpen(true);
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.detail || "Unable to generate the PDF."
      });
    }
  };

  const handleSendEmail = async () => {
    try {
      const savedResume = await createOrUpdateResume();
      await resumeApi.sendEmail(savedResume.resume_id, inputValue);
      setToast({ type: "success", message: "Resume sent by email." });
      setInputValue("");
      setIsEmailModalOpen(false);
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.detail || "Unable to send the email."
      });
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      const savedResume = await createOrUpdateResume();
      await resumeApi.sendWhatsApp(savedResume.resume_id, inputValue);
      setToast({ type: "success", message: "Resume sent by WhatsApp." });
      setInputValue("");
      setIsWhatsAppModalOpen(false);
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.detail || "Unable to send the WhatsApp message."
      });
    }
  };

  return (
    <div className="obsidian-shell min-h-screen">
      <Toast onClose={() => setToast(null)} toast={toast} />
      <header className="flex min-h-16 items-center justify-between border-b border-obsidian-border bg-obsidian-surface px-6">
        <div className="flex items-center gap-4">
          <div className="h-3.5 w-3.5 rounded-[2px] bg-accent-primary shadow-[0_0_18px_var(--accent-glow)]" />
          <div>
            <p className="font-heading text-[28px] font-semibold leading-none text-text-primary">ResumeForge</p>
            <p className="mono-meta mt-1">Obsidian Editorial Builder</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {resumeId && <div className="editorial-chip mono-meta">{resumeId}</div>}
          <Timer />
          <div className="hidden md:block mono-meta">Last Edited {formattedLastEdited}</div>
          <button className="editorial-button-secondary py-2" onClick={() => navigate("/admin")} type="button">
            Admin
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] xl:grid-cols-[520px_minmax(0,1fr)]">
        <aside className="form-panel-scroll border-r border-obsidian-border bg-obsidian-surface px-8 py-8">
          <div className="animate-fade-up">
            <p className="eyebrow">Resume Builder</p>
            <h1 className="display-title mt-3">Dynamic Resume Builder</h1>
            <p className="mono-meta mt-3">Last Edited {formattedLastEdited}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 animate-fade-up [animation-delay:80ms]">
            {STEP_TITLES.map((title, index) => (
              <button
                className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-[0.04em] transition-all duration-200 ${
                  index === activeStep
                    ? "bg-accent-primary text-[#080C10]"
                    : "border border-transparent text-text-secondary hover:text-text-primary"
                }`}
                key={title}
                onClick={() => setActiveStep(index)}
                type="button"
              >
                {title}
              </button>
            ))}
          </div>

          <main className="mt-8 space-y-6">
            <section className={`editorial-panel is-active animate-slide-fade p-6 ${isLoading ? "animate-pulse" : ""}`}>
              <div className="mb-6">
                <p className="eyebrow">Current Section</p>
                <h2 className="section-title mt-3">{STEP_TITLES[activeStep]}</h2>
                <div className="gold-divider mt-4" />
              </div>
              <ActiveForm {...formProps} />
            </section>

            <section className="editorial-panel animate-fade-up p-6 [animation-delay:160ms]">
              <div className="mb-5">
                <p className="eyebrow">Actions</p>
                <h3 className="section-title mt-3">Export & Share</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="editorial-button-primary" onClick={handleGeneratePdf} type="button">
                  Generate PDF
                </button>
                {featureConfig.download !== false && pdfMeta?.download_url && (
                  <a className="editorial-button-secondary inline-flex items-center" href={pdfMeta.download_url} target="_blank" rel="noreferrer">
                    Download
                  </a>
                )}
                {featureConfig.print !== false && (
                  <button className="editorial-button-secondary" onClick={handlePrint} type="button">
                    Print
                  </button>
                )}
                {featureConfig.email !== false && (
                  <button className="editorial-button-secondary" onClick={() => setIsEmailModalOpen(true)} type="button">
                    Send Email
                  </button>
                )}
                {featureConfig.whatsapp !== false && (
                  <button className="editorial-button-secondary" onClick={() => setIsWhatsAppModalOpen(true)} type="button">
                    WhatsApp
                  </button>
                )}
              </div>
            </section>
          </main>
        </aside>

        <section className="bg-obsidian-base px-8 py-8">
          <div className="animate-fade-up [animation-delay:240ms]">
            <div ref={previewRef}>
              <ResumePreview resumeData={resumeData} />
            </div>
          <AnalyticsPanel resumeData={resumeData} />
          </div>
        </section>
      </div>

      <ShareModal
        isOpen={isEmailModalOpen}
        label="Recipient Email"
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleSendEmail}
        title="Send Resume via Email"
        value={inputValue}
        setValue={setInputValue}
      />

      <ShareModal
        isOpen={isWhatsAppModalOpen}
        label="WhatsApp Number"
        onClose={() => setIsWhatsAppModalOpen(false)}
        onSubmit={handleSendWhatsApp}
        title="Send Resume via WhatsApp"
        value={inputValue}
        setValue={setInputValue}
      />

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="PDF Generated">
        <p className="rounded-2xl border border-gold-500/20 bg-gold-500/10 px-4 py-4 text-gold-100">
          Password: {pdfMeta?.password || "Password protection disabled"}
        </p>
        <p className="mt-3 text-sm text-white/70">Save this password. It is shown once after generation.</p>
      </Modal>
    </div>
  );
}

function ShareModal({ isOpen, title, label, value, setValue, onClose, onSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <label className="block">
        <span className="field-label">{label}</span>
        <input className="editorial-input" onChange={(event) => setValue(event.target.value)} value={value} />
      </label>
      <button className="editorial-button-primary mt-5" onClick={onSubmit} type="button">
        Send
      </button>
    </Modal>
  );
}

export default BuilderPage;
