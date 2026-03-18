import { Route, Routes } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import BuilderPage from "./pages/BuilderPage";
import ExpiredPage from "./pages/ExpiredPage";

/**
 * Root application routes for the resume builder frontend.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<BuilderPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/expired" element={<ExpiredPage />} />
    </Routes>
  );
}

export default App;
