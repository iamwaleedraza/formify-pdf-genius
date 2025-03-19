
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import './App.css'
import Index from './pages/Index'
import Patients from './pages/Patients'
import PatientForm from './pages/PatientForm'
import Forms from './pages/Forms'
import NotFound from './pages/NotFound'
import { Toaster } from './components/ui/toaster'
import Medications from './pages/Medications'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientForm />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
