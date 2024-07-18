import React from 'react'
import Search from '../../Components/Search/Search'
import Weather from '../../Components/Weather/Weather'
import './Home.css'
const Home = ({setShowLogin}) => {
 
  return (
    <div className="home-container">
        <Search  setShowLogin={setShowLogin}/>
        <Weather />
    </div>
  )
}

export default Home