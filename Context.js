import React, { createContext, useState } from "react";
// import menu from "./data/menuData";

const CartItems = createContext();

const BasketProvider = ({ children }) => {
  // const menuData = menu;
  const [cart, setCart] = useState([]);
  const [additems, setAdditems] = useState(0);

  return (
    <CartItems.Provider value={{ cart, setCart, additems, setAdditems }}>
      {children}
    </CartItems.Provider>
  );
};

export { BasketProvider, CartItems };
