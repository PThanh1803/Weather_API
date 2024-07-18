import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import {assets} from '../../assets/assets.js'

const Navbar = ({setShowLogin}) => {
  const {token ,setToken, userData, url} = React.useContext(StoreContext)

  const navigate = useNavigate();
  const logout = ()=>{
      localStorage.removeItem("token")
      setToken("");
      navigate("/");
  }

  return (
    <div>
      <div className="navbar">
        <img onClick={()=>navigate("/")} src={assets.cloud} alt="logo" className="logo"/>
        <h1>Weather Dashboard</h1>
        <div className="navbar-right">
          <img onClick={!token?()=>setShowLogin(true):()=>navigate("/notify")} className="bell" src={assets.bell} alt="Bell_icon" />
          {token && 
            <div className='navbar-profile-name'>
               <h3>Hello </h3> 
               <p>{userData.name}</p>  
            </div>}
          {!token ?  <button onClick={()=>setShowLogin(true)}>Sign in</button>: 
                  <div className='navbar-profile'>
                      <img src={assets.logout_icon} alt="" />
                      <ul className="nav-profile-dropdown">
                          <li onClick={()=>navigate("/notify")}> 
                              <img src={assets.search} alt="" />
                              <p>Setting</p>
                          </li>
                          <hr/>
                          <li onClick={logout}> 
                              <img src={assets.logout_icon} alt="" />
                              <p >Logout</p>   
                          </li>
                      </ul>
                  </div>}
        </div>
       
      </div>
    </div>
  )
}


export default Navbar