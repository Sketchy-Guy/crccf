/**
 * Reusable modal wrapper for actions and confirmations.
 */
function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(8,12,16,0.85)] px-4 backdrop-blur-[8px]">
      <div className="glass-panel w-full max-w-lg rounded-[var(--radius-lg)] border-obsidian-border bg-obsidian-surface p-10 animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title">{title}</h3>
          <button className="eyebrow hover:text-text-primary" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
