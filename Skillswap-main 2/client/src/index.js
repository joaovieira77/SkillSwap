import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/welcomePage';
import AuthPage from './pages/AuthPage';
import SkillSetupPage from './pages/SkillSetupPage';
import HomePage from './pages/homepage';
import App from './App';
import Explanation from './pages/Explanation'; // Add this import
import Swaps from './pages/Swaps'; // Import Swaps page
import SkillSwaps from './pages/SkillSwaps'; // Import SkillSwaps page
import RequestsPage from './pages/RequestsPage';
import MessagePage from './pages/MessagePage';
import ChatPage from './pages/chatPage'; // Import ChatPage
import OthersProfile from './pages/OthersProfile';
import VideoCallPage from './pages/VideoCallPage'; // Import VideoCallPage


const router = createBrowserRouter(
[
  {
    path: "/Profile",
    element: <ProfilePage />,
  },
  {
    path: "/", // Explanation is now the default page
    element: <Explanation />,
  },
  {
    path: "/welcome", // WelcomePage is now at /welcome
    element: <WelcomePage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/skills",
    element: <SkillSetupPage />,
  },
  {
    path: "/home",
    element: <HomePage />, 
  },
  {
    path: "/createswap",
    element: <Swaps/>, 
  },

  {path:"/skills/:skillName",
     element:<SkillSwaps/>,

     },
  { path:"/Requests",
    element: <RequestsPage />,
  },
  { path:"/messages",
    element: <MessagePage />,

  },
  {
  path: "/messages/:userId",
  element: <ChatPage />, // 
},
{
  path: "/profile/:userId",
  element: <OthersProfile />, // ProfilePage for viewing other users' profiles
},
  { path: "/videocall/:userId",
    element: <VideoCallPage />, // VideoCallPage for video calls
  },

  
]
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
