import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import LoginPopup from './Components/LoginPopup/LoginPopup'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Notification from './Pages/Notification/Notification'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPass from './Components/ResetPass/ResetPass'

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false)
  const [showReset, setShowReset] = React.useState(false)
  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} setShowReset={setShowReset}/>}
      {showReset && <ResetPass setShowReset={setShowReset} />}
      <div className="app">
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin} setShowReset={setShowReset}/>
        <Routes>
            <Route path='/' element={<Home setShowLogin={setShowLogin} setShowReset={setShowReset}/>}/>
            <Route path='/notify' element={<Notification/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App