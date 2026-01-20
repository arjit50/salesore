import React from 'react'
import { Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
      </Routes>
    </div>
  )
}

export default App
