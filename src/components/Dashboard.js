import React, { useContext, useEffect } from "react";
import { CommonContext } from "../CommonContext";
import { useNavigate } from "react-router-dom";
import { ERROR_MESSAGE, API_URL, API_ROUTE } from "../constants";
import axios from "axios";

function Desktop() {
  const history = useNavigate();
  //Use context for setting up the task count to be displayed on the Desktop component -
  const {
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
  } = useContext(CommonContext);
  console.log(`UseContext value: ${JSON.stringify(useContext(CommonContext))}`);

  useEffect(() => {
    getCurrentUserTasks();
  }, []);
  const getCurrentUserTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/${API_ROUTE.tasks}`);
      let tasksByCurrentUser = res.data.filter(
        (ele) => ele.fullName === currentUser.fullName
      );
      setTotalTasks(tasksByCurrentUser.length);

      let pTasks = tasksByCurrentUser.filter((e) => e.stage == 2);
      setPendingTasks(pTasks.length);

      let cTasks = tasksByCurrentUser.filter((e) => e.stage === 3);
      setCompletedTasks(cTasks.length);
    } catch (err) {
      console.log(`Error during getting the current user's tasks: ${err}`);
    }
  };
  const handleTaskManagement = (e) => {
    e.preventDefault();
    history("/taskmanagement");
  };
  const handleLogout = (e) => {
    setToken(false);
    setCurrentUser(false);
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("C_U");
    history("/");
  };
  return (
    <div className="desktop container">
      <h3>Welcome {currentUser.fullName}!</h3>
      <p>Your task counts are shown below - </p>
      <h4>Total Tasks: {totalTasks}</h4>
      <h4>Pending Tasks: {pendingTasks}</h4>
      <h4>Completed Tasks: {completedTasks}</h4>
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={handleTaskManagement}>
          Go to Task Management
        </button>
        <button className="btn btn-warning ml-20" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Desktop;
