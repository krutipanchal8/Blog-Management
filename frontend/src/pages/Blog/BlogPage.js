import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

function BlogPage() {
    const [blogs, setBlogs] = useState(); 
    const cardBg = useColorModeValue('white', 'gray.800');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    const navigate = useNavigate();
    const handleReadMoreClick = (BlogID) => {
        navigate(`/blogs/${BlogID}`);
    };

    const fetchBlogs = async () => {
        try{
        const response = await fetch(localStorage.getItem("backendUrl"));
        console.log(response);
        const blogs = await response.json();
        // console.log(data);
        // const blogs = JSON.parse(data.body);
        setBlogs(blogs);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBlogs();
            
    }, []); 

    return (
        <VStack spacing={8} align="stretch" p={5}>
            {blogs?.map((blog) => (
                <Box 
                    key={blog.BlogID} 
                    p={5} 
                    shadow="md" 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    backgroundColor={cardBg}
                    _hover={{ bg: hoverBg, transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                    mx="10%" 
                >
                    <VStack align="start" spacing={4}>
                        <Heading size="lg">{blog.title}</Heading>
                        <Text color="gray.500" fontSize="sm">{`By ${blog.author} | Posted on ${blog.DatePosted}`}</Text>
                        <Text noOfLines={3}>{blog.summary}</Text>
                    </VStack>
                    <Flex justifyContent="flex-end" mt={4}>
                        <Button size="sm" colorScheme="blue" onClick={() => handleReadMoreClick(blog.BlogID)}>Read More</Button>
                    </Flex>
                </Box>
            ))}
            <Flex justifyContent="flex-end" mt={8}>
                <Button colorScheme="teal" size="lg" shadow="md">View More</Button>
            </Flex>
        </VStack>
    );
}

export default BlogPage;
