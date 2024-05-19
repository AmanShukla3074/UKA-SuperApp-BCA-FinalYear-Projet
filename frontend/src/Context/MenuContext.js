import React, { createContext, useState,useEffect } from 'react'
// import Menu from '../Components/Menu/Menu';

// import axios from 'axios';
export const MenuContext = createContext(null);

// const getDefaultCart = () =>{
//     let cart = {}
//     for(let i=1; i < Menu.length +1;i++){
//         cart[i]=0;
//     }
//     return cart;

// };

export const MenuContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

    // const [cartItems,setCartItems] = useState();
    const [cartCounts, setCartCounts] = useState(0);
    const [showCarts, setShowCarts] = useState(false);
    // const addToCart = (itemId) => {
    //     setCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}))
// ``};
// console.log("MenuDate ",data)
const addToCart = (itemId) => {
  setCartItems((prev) => ({
    ...prev,
    [itemId]: Math.max(0, prev[itemId] || 0) + 1,
  }));
};
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}))
    };
    const updateCartItemCount = (newAmount, itemId) => {
      setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
    };
    // const Count = (itemId) => {
    //     setCartItems((prev) => ({...prev, [itemId]: (prev[itemId] || 0) + 1}))
    // };
    const handleAddToCart = (itemId) => {
        setCartCounts((prevCounts) => ({ ...prevCounts, [itemId]: 1 }));
        setShowCarts((prevShowCarts) => ({ ...prevShowCarts, [itemId]: true }));
      };
      
      // const handleIncrement = (itemId) => {
      //   setCartCounts((prevCounts) => ({ ...prevCounts, [itemId]: (prevCounts[itemId] || 0) + 1 }));
      // };
      
      // const handleDecrement = (itemId) => {
      //   setCartCounts((prevCounts) => ({ ...prevCounts, [itemId]: Math.max(0, (prevCounts[itemId] || 0) - 1) }));
      //   setShowCarts((prevShowCarts) => ({ ...prevShowCarts, [itemId]: cartCounts[itemId] > 1 }));
      // };
    //   const [menuData, setMenuData] = useState([]);
    //   useEffect(() => {
    //     const fetchMenuData = async () => {
    //       try {
    //         const response = await axios.get("http://127.0.0.1:8000/api/menulist/");
    //         // const filteredMenuData = response.data.filter((item) => item.Item_ID === cartItems);

    //         setMenuData(response.data);
    //         // setMenuData(filteredMenuData);
    //       } catch (error) {
    //         console.error('Error fetching menu data:', error);
    //       }
    //     };
    
    //     fetchMenuData();
    //   }, []);
    // console.log("*******")
    // console.log("CartinMenuC",cartItems)
     

      const contextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemCount,
        handleAddToCart,
        // menuData,
      };
    return (<MenuContext.Provider value={contextValue} >{props.children}</MenuContext.Provider>)
  
};