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

const App = () => {
  return (
    <div>
 
      
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>

        <Route path='/info' element={<Info/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/pricing' element={<Pricing/>}/>

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
      </Routes>
    </div>
  )
}

export default App
