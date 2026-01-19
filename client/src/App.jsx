import React from 'react'
import { Route, Routes } from 'react-router'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<h1>home page</h1>}/>
        <Route path='/login' element={<h1>login page</h1>}/>
        <Route path='/signup' element={<h1>signup page</h1>}/>
      </Routes>
    </div>
  )
}

export default App
