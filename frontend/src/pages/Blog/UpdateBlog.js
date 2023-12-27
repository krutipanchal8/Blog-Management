import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const UpdateBlog = () => {
    const { BlogID } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [title, setTitle] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        setIsLoggedIn(Boolean(userEmail));

        if (BlogID) {
            fetchBlogDetails(BlogID);
        }
    }, [BlogID]);

    const fetchBlogDetails = async (blogId) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ BlogID: BlogID })
            };
            const response = await fetch(`${localStorage.getItem("backendUrl")}post`, requestOptions);
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Blog Data: ", data); 
                setAuthor(data.author);
                setContent(data.content);
                setSummary(data.summary);
                setTitle(data.title);
            } else {
                console.error('Failed to fetch blog data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching blog details:', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('You need to log in first.');
            return;
        }

        const blogData = {
            BlogID: BlogID || generateUniqueID(),
            author,
            content,
            summary,
            title,
            email: localStorage.getItem('userEmail') 
        };

        try {
            const requestOptions = {
                method: BlogID ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            };
            const response = await fetch(localStorage.getItem("backendUrl"), requestOptions);

            if (response.ok) {
                alert(`Blog post ${BlogID ? 'updated' : 'created'} successfully!`);
                navigate(`/`);
            } else {
                alert(`Failed to ${BlogID ? 'update' : 'create'} the blog post.`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        }
    };

    const generateUniqueID = () => {
        return `blog-${new Date().getTime()}`;
    };

    return (
        <Box p={4} m="auto" maxWidth="800px">
            <br />
            <br />
            <br />
            {!isLoggedIn && (
                <Alert status="warning" mb={4}>
                    <AlertIcon />
                    You need to log in first to create a blog. Please <a href="/login" style={{ textDecoration: 'underline' }}>login</a>.
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
                <Button mt={4} colorScheme="teal" type="submit">{BlogID ? 'Update Blog' : 'Create Blog'}</Button>
            </form>
        </Box>
    );
};

export default UpdateBlog;
