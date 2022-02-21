import React, { useState, createContext } from "react";

const CommonContext = createContext("");
const CommonContextProvider = ({ children }) => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [token, setToken] = useState(
    localStorage.getItem("AUTH_TOKEN") || false
  );
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("C_U")) || false
  );
  const [isDragging, setIsDragging] = useState(false);

  return (
    <CommonContext.Provider
      value={{
        totalTasks,
        setTotalTasks,
        pendingTasks,
        setPendingTasks,
        completedTasks,
        setCompletedTasks,
        token,
        setToken,
        isDragging,
        setIsDragging,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

export { CommonContext, CommonContextProvider };
