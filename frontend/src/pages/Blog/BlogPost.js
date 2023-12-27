import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  useColorModeValue,
  Spacer,
  Flex,
  Button
} from "@chakra-ui/react";

const BlogPost = () => {
    let { BlogID } = useParams();
    const navigate = useNavigate();
    const [blogDetails, setBlogDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('userEmail');

    const titleColor = useColorModeValue('teal.600', 'teal.300');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const infoColor = useColorModeValue('gray.500', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        const getBlogInformation = async () => {
            try {
                setLoading(true);
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ BlogID: BlogID })
                };
                const response = await fetch(`${localStorage.getItem("backendUrl")}post`, requestOptions);
                if (response.ok) {
                    const responseData = await response.json();
                    setBlogDetails(responseData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog post:', error);
            }
        };
        getBlogInformation();
    }, [BlogID]);

    const handleDelete = async () => {
        // Assuming BlogID is used to delete the blog post
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ BlogID: BlogID })
        };
        try {
            const response = await fetch(localStorage.getItem("backendUrl"), requestOptions);
            if (response.ok) {
                alert('Blog post deleted successfully!');
                navigate('/'); // Redirect to home or another appropriate page
            } else {
                alert('Failed to delete the blog post.');
            }
        } catch (error) {
            console.error('Error deleting blog post:', error);
        }
    };

    return (
        <Container maxW="container.xl" py={5}>
            {!loading && blogDetails && (
                <Box borderRadius="lg" overflow="hidden" p={6} boxShadow="lg" bg={bgColor}>
                    <VStack spacing={4} align="start">
                        <Heading size="2xl" mb={4} color={titleColor}>{blogDetails.title}</Heading>
                        <Text fontSize="lg" color={textColor}>{blogDetails.content}</Text>
                        <Heading size="md" pt={4} color={infoColor}>Summary</Heading>
                        <Text fontSize="lg" color={textColor}>{blogDetails.summary}</Text>
                        <Spacer />
                        <Flex w="full" justify="flex-end" align="end">
                            <Box textAlign="right">
                                <Text fontSize="lg" fontWeight="bold" color={textColor}>{blogDetails.author}</Text>
                                <Text fontSize="sm" color={textColor}>Posted on {blogDetails.DatePosted}</Text>
                            </Box>
                            
                        </Flex>
                        {blogDetails.email === userEmail && (
                                <Flex gap="2">
                                    <Button colorScheme="blue" onClick={() => navigate(`/update-blog/${BlogID}`)}>Update</Button>
                                    <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                                </Flex>
                            )}
                    </VStack>
                </Box>
            )}
        </Container>
    );
}

export default BlogPost;
