import React, { useState, useEffect, useContext } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";
import Task from "./Task";
import { CommonContext } from "../CommonContext";
import { ERROR_MESSAGE, API_URL, API_ROUTE } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { date } from "yup";
import { Popconfirm } from "antd";

const snames = ["Backlog", "To Do", "Ongoing", "Done"];
let taskAtHand;
let dt = new Date();

function TaskManagement(props) {
  const [stageNames, setStageNames] = useState(snames);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(0);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("high");
  const [deadline, setDeadline] = useState(new Date().toDateString());
  const [isEdit, setIsEdit] = useState(false);
  const [taskStages, setTaskStages] = useState([]);
  const history = useNavigate();

  //   const {
  //     tasks,
  //     setTasks,
  //     stageNames,
  //     setStageNames,
  //     title,
  //     setTitle,
  //     priority,
  //     setPriority,
  //     deadline,
  //     setDeadline,
  //   } = props;

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

  const setTaskCount = () => {
    const pendingTasks = tasks.filter((t) => t.stage === 2);
    const completedTasks = tasks.filter((t) => t.stage === 3);
    setTotalTasks(tasks.length);
    setPendingTasks(pendingTasks.length);
    setCompletedTasks(completedTasks.length);
  };

  //Get tasks based on the username - coming from currentUser
  async function getTasksByUserName() {
    const res = await axios.get(`${API_URL}/${API_ROUTE.tasks}`);
    let tasksByCurrentUser = res.data.filter(
      (ele) => ele.fullName === currentUser.fullName
    );
    //console.log(currentUser);
    //console.log(tasksByCurrentUser);
    setTasks(tasksByCurrentUser);
  }

  //Add a task to the tasks array of the current user in db.json
  async function addEditTask() {
    //If the task is a new task then add the task in the tasks array of db.json
    if (title && !isEdit) {
      let newTask = {
        fullName: currentUser.fullName,
        name: title,
        stage: 0,
        priority: priority,
        deadline: deadline,
      };
      //console.log(`New Task: ${newTask}`);
      try {
        const response = await axios.post(
          `${API_URL}/${API_ROUTE.tasks}`,
          newTask
        );
        if (response) {
          // setLoading(false);
          console.log("New task created successfully.");
        }
      } catch (err) {
        console.log(`Error while adding a new task: ${err}`);
      }
    }
    //if the edit button on the task is clicked then edit the task in the task for the current user.
    if (title && isEdit) {
      console.log(taskAtHand);

      // setLoading(true);
      try {
        let taskTobeEdited = tasks.find((t) => t.id === taskAtHand);
        let editedTask = {
          fullName: currentUser.fullName,
          name: title,
          stage: taskTobeEdited.stage,
          priority: priority,
          deadline: deadline,
        };
        const response = await axios.put(
          `${API_URL}/${API_ROUTE.tasks}/${taskAtHand}`,
          editedTask
        );
        if (response) {
          // setLoading(false);
          console.log("Task edited successfully.");
          setIsEdit(false);
        }
      } catch (error) {
        // setLoading(false);
        console.log(`Error at task editing: ${error}`);
        setIsEdit(false);
      }
    }
    setTitle("");
    setPriority("high");
    setDeadline("");
    setIsEdit(false);
    //  setTasks(ts);
    getTasksByUserName();
  }
  //useEffect for getting the tasks
  useEffect(() => {
    getTasksByUserName();
  }, []);
  //Set different task counts - Total tasks, pending tasks and completed tasks
  useEffect(() => {
    setTaskCount();
  }, [tasks, setTasks]);

  //All stages
  const stages = [];
  //Initialize the array of stages.
  for (let i = 0; i < stageNames.length; i++) {
    stages.push([]);
  }
  //Put task as per their stages inside the stage array
  for (let task of tasks) {
    stages[task.stage].push(task);
  }

  //Put the task stages into a state variable
  //setTaskStages(stages);

  const addTask = () => {
    const ts = tasks;
    if (title && !isEdit) {
      ts.push({
        name: title,
        stage: 0,
        priority: priority,
        deadline: deadline,
      });
      console.log(
        `name - ${title} priority: ${priority} deadline - ${deadline}`
      );
    }
    if (title && isEdit) {
      let taskTobeEdited = ts.find((t) => t.name === title);
      let editIndex = ts.indexOf(taskTobeEdited);
      console.log(
        `edit index - ${editIndex} name - ${title} priority: ${priority} deadline - ${deadline}`
      );
      let editedTask = {
        name: title,
        stage: taskTobeEdited.stage,
        priority: priority,
        deadline: deadline,
      };
      ts.splice(editIndex, 1, editedTask);
      // console.log(ts.splice(editIndex, 1, editedTask));
      //console.log(ts);
    }
    setTitle("");
    setPriority("high");
    setDeadline("");
    setIsEdit(false);
    setTasks(ts);
    //Update different task counts
    setTaskCount();
  };
  const backwardBtnHandler = async (id) => {
    let ts = [];
    let backwardTask = {};
    ts = tasks.map((t) => {
      if (t.id === id) {
        backwardTask = {
          fullName: t.fullName,
          name: t.name,
          priority: t.priority,
          deadline: t.deadline,
          stage: t.stage === 0 ? 0 : t.stage - 1,
        };

        return backwardTask;
      } else return t;
    });
    console.log(`backwardTask: ${JSON.stringify(backwardTask)}`);
    //Update the database -
    try {
      const response = await axios.put(
        `${API_URL}/${API_ROUTE.tasks}/${id}`,
        backwardTask
      );
      if (response) {
        // setLoading(false);
        console.log("Task edited successfully.");
      }
    } catch (error) {
      // setLoading(false);
      console.log(`Error at task editing: ${error}`);
    }
    setTasks(ts);
  };

  const forwardBtnHandler = async (id) => {
    let ts = [];
    let forwardTask = {};
    ts = tasks.map((t) => {
      if (t.id === id) {
        forwardTask = {
          fullName: t.fullName,
          name: t.name,
          priority: t.priority,
          deadline: t.deadline,
          stage: t.stage === 3 ? 3 : t.stage + 1,
        };
        return forwardTask;
      } else return t;
    });
    console.log(`forwardTask: ${JSON.stringify(forwardTask)}`);
    //Update the database -
    try {
      const response = await axios.put(
        `${API_URL}/${API_ROUTE.tasks}/${id}`,
        forwardTask
      );
      if (response) {
        // setLoading(false);
        console.log("Task edited successfully.");
      }
    } catch (error) {
      // setLoading(false);
      console.log(`Error at task editing: ${error}`);
    }
    setTasks(ts);
  };

  const deleteBtnHandler = async (id) => {
    const ts = tasks.filter((t) => t.id !== id);
    //setTaskId(id);
    try {
      const response = await axios.delete(
        `${API_URL}/${API_ROUTE.tasks}/${id}`
      );
      if (response) {
        // setLoading(false);
        console.log("Task deleted successfully.");
      }
    } catch (err) {
      console.log(`Error occurred while deleting the task: ${err}`);
    }
    setTasks(ts);
  };
  const cancelDelete = (e) => {
    return false;
  };
  const handleDeleteTask = () => {
    console.log(`handle delete task: ${taskAtHand}`);
    // try {
    //   deleteBtnHandler(taskAtHand);
    //   console.log("Task deleted successfully.");
    // } catch (err) {
    //   console.log("Error while deleting the task.");
    // }
  };

  const editBtnHandler = (id) => {
    setIsEdit(true);
    let taskTobeEdited = tasks.find((t) => t.id === id);
    setTitle(taskTobeEdited.name);
    setPriority(taskTobeEdited.priority);
    setDeadline(taskTobeEdited.deadline);
    //setTaskId(id);
    taskAtHand = id;
    console.log(id);
    console.log(`taskId: ${taskAtHand}`);
  };

  const handleGotoDashboard = (e) => {
    e.preventDefault();
    history("/dashboard");
  };

  const handleLogout = () => {
    setToken(false);
    setCurrentUser(false);
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("C_U");
    history("/");
  };

  const handleOnDragStart = (e) => {
    console.log(`drag start - ${e.draggableId}`);
    setIsDragging(true);
    taskAtHand = e.draggableId;
  };

  const updateTheStageOfTaskDragged = async (
    arr,
    destinationIndex,
    removed
  ) => {
    await axios.put(`${API_URL}/${API_ROUTE.tasks}/${removed.id}`, {
      ...removed,
      stage: destinationIndex,
    });
    // const result = Array.from(list);
    arr.splice(destinationIndex, 0, removed);
    console.log(`arr - ${JSON.stringify(arr)}`);
    return arr;
  };

  const handleOnDragEnd = (result) => {
    console.log(`Drag end`);
    console.log(`result:${JSON.stringify(result)}`);

    if (!result.destination) {
      return;
    }
    const stagesCopy = [...stages];

    const sourceArr = stagesCopy[stageNames.indexOf(result.source.droppableId)];
    console.log(`handleOnDragEnd: ${JSON.stringify(sourceArr)}`);

    const removed = sourceArr.splice(result.source.index, 1);
    stagesCopy[stageNames.indexOf(result.source.droppableId)] = sourceArr;

    const destinationArr =
      stagesCopy[stageNames.indexOf(result.destination.droppableId)];

    console.log(removed[0]);

    stagesCopy[
      stageNames.indexOf(result.destination.droppableId)
    ] = updateTheStageOfTaskDragged(
      destinationArr,
      stageNames.indexOf(result.destination.droppableId),
      removed[0]
    );
    console.log(`stagesCopy - `);
    console.log(stagesCopy);

    setIsDragging(false);
  };

  return (
    <>
      <div className="mt-3 layout-column justify-content-center align-items-center">
        <h2>Welcome {currentUser.fullName}</h2>
        <h4>Kanban Board - Task Management</h4>
        <section className="mt-4 layout-row align-items-center justify-content-center">
          <AddTask
            taskTitle={title}
            onTaskTitleChange={setTitle}
            taskPriority={priority}
            onTaskPriorityChange={setPriority}
            taskDeadline={deadline}
            onTaskDeadlineChange={setDeadline}
            // addTask={addTask}
            addEditTask={addEditTask}
            isEdit={isEdit}
          />
        </section>
        <div className="stages mt-4 row">
          <DragDropContext
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
          >
            {stages.map((tasks, i) => {
              return (
                <div
                  className="stageCard card outlined col-6 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12"
                  key={`${i}`}
                >
                  <div className="card-text">
                    <h4>{stageNames[i]}</h4>
                    <Droppable droppableId={`${stageNames[i]}`}>
                      {(provided) => (
                        <ul
                          className="mt-4"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {tasks.map((task, index) => {
                            return (
                              <Draggable
                                key={task.id}
                                draggableId={`${task.id}`}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    key={`${task.id}`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Task
                                      taskid={task.id}
                                      taskname={task.name}
                                      taskpriority={task.priority}
                                      taskdeadline={task.deadline}
                                      backwardBtnHandler={() =>
                                        backwardBtnHandler(task.id)
                                      }
                                      forwardBtnHandler={() =>
                                        forwardBtnHandler(task.id)
                                      }
                                      deleteBtnHandler={() =>
                                        deleteBtnHandler(task.id)
                                      }
                                      editBtnHandler={() =>
                                        editBtnHandler(task.id)
                                      }
                                    />
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <div className="mb-4 mt-4">
          <button className="btn btn-secondary" onClick={handleGotoDashboard}>
            Go to Dashboard
          </button>
          <button className="btn btn-warning ml-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div>
          {isDragging && (
            <button
              className="bg-danger pt-0 m-5"
              style={{
                width: "3em",
                hight: "3em",
                right: "0",
                position: "absolute",
                bottom: "0",
                padding: "0.5em",
              }}
            >
              <Popconfirm
                title="Are you sure to delete this task?"
                onConfirm={() => deleteBtnHandler(taskAtHand)}
                onCancel={cancelDelete}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="text-light" />
              </Popconfirm>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default TaskManagement;
