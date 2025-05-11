// This component will direct the user to the appropriate page if authenticated,
// otherwise redirect to the login page

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  //Tracks whether the user is authenticated
  const [isLoading, setIsLoading] = useState(true);              //Tracks whether the authentication check is still in progress

  useEffect(() => {
    const checkAuth = async () => {                                   //Async function to check if the user is authenticated
      try {
        const response = await axios.get('/api/auth/verify', {        //Send a request to the backend to verify authentication
          withCredentials: true                                       //Send cookies with the request (for session auth)
        });
        setIsAuthenticated(response.data.authenticated);              //Set authentication status based on backend response
      } catch (err) {
        setIsAuthenticated(false);                                    //If the request fails (e.g., not authenticated), assume false
      } finally {
        setIsLoading(false);                                          //Mark the loading process as complete
      }
    };
    checkAuth();                                                      //Run the authentication check on component mount
  }, []);

  //While authentication status is being determined, show a loading state
  if (isLoading) {
    return <div>Loading...</div>;    //You can replace this with a loading spinner or animation if preferred
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;