/**
 * Small toast for success and error feedback.
 */
function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-toast-in">
      <div
        className={`min-w-[320px] rounded-[var(--radius-sm)] border border-obsidian-border bg-obsidian-elevated px-[18px] py-[14px] font-body text-[13px] text-text-primary ${
          toast.type === "error"
            ? "border-l-[3px] border-l-danger"
            : toast.type === "success"
              ? "border-l-[3px] border-l-success"
              : "border-l-[3px] border-l-warning"
        }`}
      >
        <div className="flex items-start gap-3">
          <p className="flex-1">{toast.message}</p>
          <button className="eyebrow hover:text-text-primary" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
