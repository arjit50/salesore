import React from 'react'
import { Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { Contact,Info,Pricing } from './pages/InfoPages';
import Dashboard from './pages/dashboard/Dashboard'
import Billing from './pages/billing/Billing'
import Leads from './pages/dashboard/Leads'
import Pipeline from './pages/dashboard/Pipeline'
import Customers from './pages/dashboard/Customers'
import Activities from './pages/dashboard/Activities'
import Analytics from './pages/dashboard/Analytics'
import Team from './pages/dashboard/Team'
import Settings from './pages/dashboard/Settings'
import DashboardLayout from './components/layout/DashboardLayout'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

import SalesAI from './components/SalesAI'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>

        <Route path='/info' element={<Info/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/pricing' element={<Pricing/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='leads' element={<Leads/>}/>
            <Route path='pipeline' element={<Pipeline/>}/>
            <Route path='customers' element={<Customers/>}/>
            <Route path='activities' element={<Activities/>}/>
            <Route path='analytics' element={<Analytics/>}/>
            <Route path='billing' element={<Billing/>}/>
            <Route path='team' element={<Team/>}/>
            <Route path='settings' element={<Settings/>}/>
          </Route>
        </Route>
      </Routes>
      <SalesAI />
    </AuthProvider>
  )
}

export default App
