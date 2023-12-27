import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
    const navigate = useNavigate();
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [title, setTitle] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        setIsLoggedIn(Boolean(userEmail));
    }, []);

    const getCurrentDate = () => {
        const now = new Date();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const yyyy = now.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };

    const generateUniqueID = () => {
        return `blog-${new Date().getTime()}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('You need to log in first to create a blog.');
            return;
        }

        const blogID = generateUniqueID();
        const datePosted = getCurrentDate();

        const newBlogPost = {
            title,
            author,
            content,
            DatePosted: datePosted,
            BlogID: blogID,
            summary,
            email: localStorage.getItem('userEmail'),
        };

        try {
            const response = await fetch(
                localStorage.getItem("backendUrl"),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBlogPost),
                }
            );

            if (response.ok) {
                setAuthor('');
                setContent('');
                setSummary('');
                setTitle('');
                alert('Blog post created successfully!');
                navigate('/');
            } else {
                alert('Failed to create the blog post.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while creating the blog post.');
        }
    };

    return (
        <Box p={4} m="auto" maxWidth="800px">
            <br />
            <br />
            <br />
            {!isLoggedIn && (
                <Alert status="warning" mb={4}>
                    <AlertIcon />
                    You need to log in first to create a blog. Please <a href="/login" style={{ textDecoration: 'underline' }}> login</a>.
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <FormControl id="author" isRequired mb={4}>
                    <FormLabel>Author</FormLabel>
                    <Input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </FormControl>
                <FormControl id="content" isRequired mb={4}>
                    <FormLabel>Content</FormLabel>
                    <Textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
                </FormControl>
                <FormControl id="summary" isRequired mb={4}>
                    <FormLabel>Summary</FormLabel>
                    <Textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
                </FormControl>
                <FormControl id="title" isRequired mb={4}>
                    <FormLabel>Title</FormLabel>
                    <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit">Create Blog</Button>
            </form>
        </Box>
    );
};

export default CreateBlog;
