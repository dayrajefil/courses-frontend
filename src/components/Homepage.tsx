// src/components/Homepage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  Button,
  HStack
} from '@chakra-ui/react';

const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', 
  '#E74C3C', '#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6'
];

const Homepage = () => {
  const [currentColor, setCurrentColor] = useState('#808080');

  const changeColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setCurrentColor(colors[randomIndex]);
  };

  useEffect(() => {
    const intervalId = setInterval(changeColor, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      height="400px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgColor={currentColor}
      transition="background-color 0.5s"
    >
      <VStack spacing={4}>
        <Heading color="#FFFFFF">Bem-vindo ao Course!</Heading>
        <Text fontSize="xl" color="#FFFFFF">
          Aprenda novas habilidades e desenvolva seu potencial.
        </Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={() => alert('Inscreva-se!')}>
            Inscreva-se
          </Button>
          <Button colorScheme="teal" onClick={() => alert('Saiba mais!')}>
            Saiba mais
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Homepage;
