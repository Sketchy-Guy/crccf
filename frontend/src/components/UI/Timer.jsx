import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LOCAL_STORAGE_KEYS, RESUME_SESSION_MINUTES } from "../../utils/constants";

/**
 * Persistent 20-minute countdown that redirects on expiry.
 */
function Timer() {
  const navigate = useNavigate();
  const [remainingSeconds, setRemainingSeconds] = useState(RESUME_SESSION_MINUTES * 60);

  useEffect(() => {
    const tick = () => {
      const startedAt = localStorage.getItem(LOCAL_STORAGE_KEYS.sessionStartedAt);
      if (!startedAt) {
        setRemainingSeconds(RESUME_SESSION_MINUTES * 60);
        return;
      }

      const elapsedSeconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const nextRemaining = Math.max(0, RESUME_SESSION_MINUTES * 60 - elapsedSeconds);
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0) {
        navigate("/expired");
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [navigate]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  const isCritical = remainingSeconds <= 300;

  return (
    <div
      className={`editorial-chip font-mono text-[13px] ${
        isCritical
          ? "animate-pulse-danger border-danger text-danger"
          : "text-text-primary"
      }`}
    >
      Time Left: {minutes}:{seconds}
    </div>
  );
}

export default Timer;
