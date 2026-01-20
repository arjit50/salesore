import React from 'react'
import { Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { Contact,Info,Pricing } from './pages/InfoPages';
import Dashboard from './pages/dashboard/Dashboard'
import Billing from './pages/billing/Billing'

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

        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/billing' element={<Billing/>}/>
      </Routes>
    </div>
  )
}

export default App
