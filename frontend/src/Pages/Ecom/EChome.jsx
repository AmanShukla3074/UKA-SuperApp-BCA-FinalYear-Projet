import React, { useEffect, useState } from 'react'
import { Hero, ProductContainer } from '../../Components'
import axios from 'axios';


function EChome() {
  
  return (
    <div>
      <Hero/>
      {/* <ProductContainer header="POPULAR PRODUCTS!" /> */}
      <ProductContainer category="hoodie" header="SHOP HOODIES!"/> 
      <ProductContainer category="Sweatshirts" header="SHOP SWEATSHIRTS!"/> 
      <ProductContainer category="caps" header="SHOP CAPS!"/> 
      <ProductContainer category="jeans" header="SHOP JEANS!"/> 
      <ProductContainer category="shoes" header="SHOP SHOES!"/> 
    </div>
  )
}

export default EChome
