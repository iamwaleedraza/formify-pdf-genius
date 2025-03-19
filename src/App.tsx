
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Patients from "@/pages/Patients";
import NotFound from "@/pages/NotFound";
import PatientForm from "@/pages/PatientForm";
import Medications from "@/pages/Medications";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientForm />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
