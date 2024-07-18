import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import LoginPopup from './Components/LoginPopup/LoginPopup'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Notification from './Pages/Notification/Notification'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false)
  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin}/>}
      <div className="app">
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
            <Route path='/' element={<Home setShowLogin={setShowLogin}/>}/>
            <Route path='/notify' element={<Notification/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App