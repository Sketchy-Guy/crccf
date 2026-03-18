import { Link } from "react-router-dom";

/**
 * Expiry page shown when the 20-minute session runs out.
 */
function ExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-xl p-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-400">Session Closed</p>
        <h1 className="mt-4 font-heading text-4xl text-white">Resume submission time has expired.</h1>
        <p className="mt-4 text-white/70">Please contact the administrator.</p>
        <Link className="mt-6 inline-flex rounded-full border border-gold-500/20 px-4 py-2 text-sm text-gold-100" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default ExpiredPage;
