import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const server = 'http://10.157.136.62:3000/api';
  
  console.log("Server is :", server);
 
  const Logout=async()=>{
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage', error);
    }
  }

  const [user, setUser] = useState(null);
  const [instructed, setInstructed] = useState(false);
  
 

  const getConfig = () => {
    const token = user?.token;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  const getUser=async()=>{
    return user;
  }
  // Auth APIs
  const login = async (data) => {
    const url = `${server}/auth/login`;
    try {
      const response = await axios.post(url, data);
      console.log("Login API Response:", response.data);
  
      if (response.data && response.data.data) {
        const loggedInUser = response.data.data;
        setUser(loggedInUser);
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
        console.log("User saved to AsyncStorage:", loggedInUser); // Debugging log
      } else {
        console.warn("User data missing in response");
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow to propagate error to UI
    }
  };

 
  
  

  


  const provider = {
    //Auth
    setUser,user
  };

  return <AppContext.Provider value={provider}>{children}</AppContext.Provider>;
};
const useAPP = () => useContext(AppContext);

export { AppProvider, useAPP,AppContext };
