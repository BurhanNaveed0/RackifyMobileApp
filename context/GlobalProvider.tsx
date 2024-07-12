import { getCurrentUser } from '@/lib/appwrite';
import React, {createContext, useContext, useEffect, useState} from 'react'

// Define the type for the context value
interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

const GlobalProvider = ( {children} : {children: any}  ) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ user, setUser ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const updateUserData = async () => {
      const user:any = getCurrentUser();

      user
        .then((res : any) => {
          if(res) {
            setIsLoggedIn(true);
            setUser(res);
            console.log(res);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch((error : any) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }

    const interval = setInterval(() => {
      updateUserData();
    }, 3000);

    return () => clearInterval(interval);
  }, [user, isLoggedIn, isLoading]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn, 
        setIsLoggedIn,
        user, 
        setUser,
        isLoading,
        setIsLoading
      }}
    >
      { children }
    </GlobalContext.Provider>
  )
}

export default GlobalProvider