import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import './App.css';
import LayoutWithNav from './pages/Layout/LayoutWithNav';
import LayoutWithoutNav from './pages/Layout/LayoutWithoutNav';
import BlogPage from './pages/Blog/BlogPage';
import BlogPost from './pages/Blog/BlogPost';
import Login from './pages/Login/Login';
import CreateBlog from './pages/Blog/CreateBlog';
import SignUp from './pages/Login/SignUp';
import UpdateBlog from './pages/Blog/UpdateBlog';
import AWS from "aws-sdk";

const router = createBrowserRouter([
  {
    element: <LayoutWithNav />,
    children: [
      {
        path: "/",
        element: <BlogPage />
      },
      {
        path: "/blogs/:BlogID/",
        element: <BlogPost />
      },
      {
        path: "/create-blog",
        element: <CreateBlog />
      },
      {
        path: "/update-blog/:BlogID/",
        element: <UpdateBlog />
      },
    ]
  },
  {
    element: <LayoutWithoutNav />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/sign-up",
        element: <SignUp />
      }
    ]
  }
]);

export const fetchBackendUrl = async () => {
  AWS.config.update({
    region: "us-east-2",
    credentials: {
      accessKeyId: "AKIA2LJCAJ3ELU7L3EME",
      secretAccessKey: "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",
    },
  });
  const secretsManager = new AWS.SecretsManager();

  const data = await secretsManager
    .getSecretValue({
      SecretId: "/api-gateway-url",
    })
    .promise();

  if (data.SecretString) localStorage.setItem("backendUrl", data.SecretString);
};

function App() {
  fetchBackendUrl();
  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <RouterProvider router ={router} />
      </ChakraProvider>
    </div>
  );
}

export default App;