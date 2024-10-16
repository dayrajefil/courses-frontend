// src/javascripts/App.js
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Homepage from './Homepage';

const App = () => {
  return (
    <ChakraProvider>
      <Homepage />
    </ChakraProvider>
  );
};

export default App;
