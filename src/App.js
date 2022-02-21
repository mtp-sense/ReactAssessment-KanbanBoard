import "./App.css";
import TaskManagement from "./components/TaskManagement";
import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CommonContext, CommonContextProvider } from "./CommonContext";
import Login from "./components/Login";
function App() {
  return (
    //With Router
    <CommonContextProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/taskmanagement" element={<TaskManagement />} />
            <Route exact path="/" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </CommonContextProvider>

    //Without Router
    // <TaskCountContextProvider>
    //   <div className="App">
    //     <h2>Kanban Board</h2>
    //     <Desktop />
    //     <TaskManagement />
    //   </div>
    // </TaskCountContextProvider>
  );
}

export default App;
