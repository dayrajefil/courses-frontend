// src/components/Header.tsx
import React from 'react';
import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Box className="header">
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xl">Course</Text>
        <HStack spacing={4}>
          <Link color="white" href="/">Home</Link>
          <Link color="white" href="/courses">Cursos</Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
