import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Summary from "./pages/Summary";
import Compare from "./pages/Compare";
import PDFViewer from "./pages/PDFViewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Welcome / Onboarding */}
        <Route path="/welcome" element={<Welcome />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Features */}
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/compare" element={<Compare />} />

        {/* PDF Viewer */}
        <Route
          path="/viewer/:filename"
          element={<PDFViewer />}
        />

        {/* Optional Home */}
        <Route path="/home" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

