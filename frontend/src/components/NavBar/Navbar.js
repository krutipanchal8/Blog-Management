import { Box, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const buttonHoverBgColor = useColorModeValue('blue.600', 'blue.300'); 
    const buttonHoverTextColor = useColorModeValue('white', 'gray.800'); 
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        navigate('/login');
    }

    return (
        <Flex
            as="nav"
            alignItems="center"
            justify="space-between"
            h="10vh"
            w="100%"
            backgroundColor={bgColor}
            boxShadow="sm"
            px="6"
        >
            <NavLink to="/">
                <Text
                    fontWeight="bold"
                    color={textColor}
                    fontSize="4xl"
                >
                    BlogSphere
                </Text>
            </NavLink>
            <Flex gap="24px" alignItems="center">
                <Box>
                    <NavLink to='/'>
                        <Text fontWeight="medium" color={textColor} fontSize="lg">View Blogs</Text>
                    </NavLink>
                </Box>
                <Box>
                    <NavLink to='/create-blog'>
                        <Text fontWeight="medium" color={textColor} fontSize="lg">Create Blog</Text>
                    </NavLink>
                </Box>
                {userEmail ? (
                    <Button
                        fontWeight="medium"
                        colorScheme="blue"
                        variant="solid"
                        fontSize="md"
                        _hover={{
                            bg: buttonHoverBgColor,
                            color: buttonHoverTextColor,
                            transform: 'scale(1.05)'
                        }}
                        onClick={handleLogout}
                    >
                        Log Out
                    </Button>
                ) : (
                    <>
                        <NavLink to='/sign-up'>
                            <Button
                                fontWeight="medium"
                                colorScheme="blue"
                                variant="solid"
                                fontSize="md"
                                _hover={{
                                    bg: buttonHoverBgColor,
                                    color: buttonHoverTextColor,
                                    transform: 'scale(1.05)'
                                }}
                            >
                                Sign In/Up
                            </Button>
                        </NavLink>
                        <NavLink to='/login'>
                            <Button
                                fontWeight="medium"
                                colorScheme="blue"
                                variant="solid"
                                fontSize="md"
                                _hover={{
                                    bg: buttonHoverBgColor,
                                    color: buttonHoverTextColor,
                                    transform: 'scale(1.05)'
                                }}
                            >
                                Login
                            </Button>
                        </NavLink>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

export default NavBar;
