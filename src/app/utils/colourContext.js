import React, { createContext, useContext, useState } from 'react';

const ColorContext = createContext();

export const useColor = () => {
  return useContext(ColorContext);
};

export const ColorProvider = ({ children }) => {
  const [selectedColor, setSelectedColor] = useState('#FF5733'); // Default color

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <ColorContext.Provider value={{ selectedColor, handleColorChange }}>
      {children}
    </ColorContext.Provider>
  );
};
