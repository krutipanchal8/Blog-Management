import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  VStack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };
        try {
            const response = await fetch(`${localStorage.getItem("backendUrl")}login`, requestOptions);
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('userEmail', formData.email);
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }
    }

    return (
        <Container centerContent maxW="container.sm" py={5}>
            <Box borderRadius="lg" overflow="hidden" p={6} boxShadow="lg" bg={useColorModeValue('white', 'gray.800')} w="full">
                <VStack spacing={4} align="stretch">
                    <Heading size="lg" mb={6}>Login</Heading>
                    {error && <Text color="red.500">{error}</Text>}
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={error}>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </FormControl>
                        <FormControl mt={4} isInvalid={error}>
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                            />
                            <FormErrorMessage>{error}</FormErrorMessage>
                        </FormControl>
                        <Button mt={4} width="full" colorScheme="teal" type="submit">Login</Button>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
}

export default Login;
