import React from 'react'
// import hero from '../../Assets/hero4.png'
import hero from '../../Assets/hero.png'
import './Hero.css'
const Hero = () => {
  return (
    <div className="hero">
        <img src={hero} className='heroImg' />
    </div> 
  )
}

export default Hero
