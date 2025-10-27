import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import RegisterCustomer from './pages/RegisterCustomer'
import PasswordResetRequest from './pages/PasswordResetRequest'
import PasswordReset from './pages/PasswordReset'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { UserProvider, useUser } from './context/UserContext'
import { DelayProvider } from "./context/DelayContext";
import AppointmentsConfig from './pages/AppointmentsConfig'
import { useState, useEffect } from 'react';
import ErrorPage from './components/ErrorPage'




function Logout() {
  const { setUser } = useUser();

  useEffect(() => {
    localStorage.clear()
    setUser(null);
  }, []);

  return <Navigate to="/Login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <RegisterCustomer />
}


function App() {

  return (
    <DelayProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/password_reset_request" element={<PasswordResetRequest />} />
            <Route path="/password_reset/:uid/:token" element={<PasswordReset />} />
            <Route path="/register_customer" element={<RegisterAndLogout />} />
            <Route path="/appointments_config" element={<AppointmentsConfig />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </DelayProvider>

  )
}

export default App
