// UserContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context data
interface UserContextType {
  user: { image: string; name: string; email: string } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{ image: string; name: string; email: string } | null>
  >;
}

// Provide a default value matching the shape
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {}, // No-op function
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    image: string;
    name: string;
    email: string;
  } | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
