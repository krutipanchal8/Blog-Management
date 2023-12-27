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
  useColorModeValue,
  Link as ChakraLink
} from "@chakra-ui/react";
import { Link } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userID: generateUserID(),
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    function generateUserID() {
        return Math.random().toString(36).substr(2, 9);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setGeneralError('');
    }

    const validateForm = () => {
        let errors = {};
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const data  = { 
                    userID: formData.userID, 
                    firstName: formData.firstName, 
                    lastName: formData.lastName, 
                    email: formData.email, 
                    password: formData.password };
            console.log(data);
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                };
                const response = await fetch(`${localStorage.getItem("backendUrl")}register`, requestOptions);
                console.log("response", response);
                if (response.ok) {
                    navigate('/login'); 
                } else if (response.status === 409) {
                    // Handle email already exists error
                    const result = await response.json();
                    setGeneralError(result.error || 'Email already registered');
                } else {
                    // Handle other errors
                    console.error('Registration failed:', await response.text());
                }
            } catch (error) {
                console.error('Network or other error:', error);
            }
        }
    }
    

    return (
        <Container centerContent maxW="container.sm" py={5} marginTop={"50px"}>
            <Box borderRadius="lg" overflow="hidden" p={6} boxShadow="lg" bg={useColorModeValue('white', 'gray.800')} w="full">
                <VStack spacing={4} align="stretch">
                    <Heading size="lg" mb={6}>Signup</Heading>
                    {generalError && <Text color="red.500">{generalError}</Text>}
                    <form onSubmit={handleSubmit}>
                        {['firstName', 'lastName', 'email', 'password', 'confirmPassword'].map((field) => (
                            <FormControl key={field} isInvalid={formErrors[field]}>
                                <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                                <Input 
                                    type={field.includes('password') ? 'password' : 'text'} 
                                    name={field} 
                                    value={formData[field]} 
                                    onChange={handleChange} 
                                />
                                <FormErrorMessage>{formErrors[field]}</FormErrorMessage>
                            </FormControl>
                        ))}
                        <Button mt={4} width="full" colorScheme="teal" type="submit">Submit</Button>
                        <Box textAlign="center" mt={4}>
                            <ChakraLink as={Link} to="/login" color="teal.500">Already have an account? Please login</ChakraLink>
                        </Box>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
}

export default SignUp;
