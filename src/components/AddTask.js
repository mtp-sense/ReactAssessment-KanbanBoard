import React from "react";

function AddTask(props) {
  return (
    <div className="addTaskContainer container">
      {/* <div className="row">
        <label className="col-6">Id: {props.id}</label>
      </div> */}
      <div className="row">
        <label className="col-4">Enter task title</label>
        <input
          className="col-6"
          // className="mx-auto"
          // style={{ width: "30em" }}
          type="text"
          value={props.taskTitle}
          required
          onChange={(e) => props.onTaskTitleChange(e.target.value)}
        />
      </div>
      <div className="row">
        <label className="col-4">Enter task priority</label>
        <select
          className="col-6"
          // className="mx-auto"
          // style={{ width: "30em" }}
          onChange={(e) => props.onTaskPriorityChange(e.target.value)}
        >
          {/* <option selected value="select priority">
            Select Priority
          </option> */}
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="row">
        <label className="col-4">Enter task deadline</label>
        <input
          className="col-6"
          type="date"
          value={props.taskDeadline}
          required
          onChange={(e) => props.onTaskDeadlineChange(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={props.addEditTask}>
          Save Task
        </button>
      </div>
    </div>
  );
}

export default AddTask;
