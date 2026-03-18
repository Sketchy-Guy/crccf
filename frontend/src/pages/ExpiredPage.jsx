import { useNavigate } from "react-router-dom";

import { LOCAL_STORAGE_KEYS } from "../utils/constants";

/**
 * Expiry page shown when the 20-minute session runs out.
 */
function ExpiredPage() {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.sessionStartedAt);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.resumeId);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-xl p-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-400">Session Closed</p>
        <h1 className="mt-4 font-heading text-4xl text-white">Resume submission time has expired.</h1>
        <p className="mt-4 text-white/70">Please contact the administrator.</p>
        <button
          className="mt-6 inline-flex rounded-full border border-gold-500/20 px-4 py-2 text-sm text-gold-100"
          onClick={handleReturnHome}
          type="button"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default ExpiredPage;
