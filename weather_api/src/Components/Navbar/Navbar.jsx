import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({setShowLogin}) => {
  const {token ,setToken, userData} = React.useContext(StoreContext)

  const navigate = useNavigate();
  const logout = ()=>{
      localStorage.removeItem("token")
      setToken("");
      navigate("/");
  }

  return (
    <div>
      <div className="navbar">
        <img onClick={()=>navigate("/")} src="/src/assets/cloud.png" alt="logo" className="logo"/>
        <h1>Weather Dashboard</h1>
        <div className="navbar-right">
          <img onClick={!token?()=>setShowLogin(true):()=>navigate("/notify")} className="bell" src="/src/assets/bell.png" alt="" />
          {token && 
            <div className='navbar-profile-name'>
               <h3>Hello </h3> 
               <p>{userData.name}</p>  
            </div>}
          {!token ?  <button onClick={()=>setShowLogin(true)}>Sign in</button>: 
                  <div className='navbar-profile'>
                      <img src="/src/assets/profile_icon.png" alt="" />
                      <ul className="nav-profile-dropdown">
                          <li onClick={()=>navigate("/notify")}> 
                              <img src="/src/assets/search.png" alt="" />
                              <p>Setting</p>
                          </li>
                          <hr/>
                          <li onClick={logout}> 
                              <img src="/src/assets/logout_icon.png" alt="" />
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