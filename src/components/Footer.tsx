// src/components/Footer.tsx
import React from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box className='footer' bg="gray.800" color="white" py={4} textAlign="center">
      <Stack spacing={2}>
        <Text>Course - Dayra Jefil &copy; {new Date().getFullYear()}</Text>
      </Stack>
    </Box>
  );
};

export default Footer;
