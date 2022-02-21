import React from "react";
import { Popconfirm } from "antd";
import "antd/dist/antd.css";

function Task(props) {
  const {
    taskid,
    taskname,
    taskpriority,
    taskdeadline,
    backwardBtnHandler,
    forwardBtnHandler,
    deleteBtnHandler,
    editBtnHandler,
  } = props;

  const cancelDelete = (e) => {
    return false;
  };

  return (
    <div className="card task">
      <div>
        <h6>
          <u>Title:</u> {taskname}
        </h6>
        <h6>
          <u>Priority:</u> {taskpriority}
        </h6>
        <h6>
          <u>Deadline:</u> {taskdeadline}
        </h6>
      </div>
      <div className="taskButtons">
        <button onClick={() => backwardBtnHandler(taskid)}>
          <i>Backward</i>
        </button>
        <button onClick={() => forwardBtnHandler(taskid)}>
          <i>Forward</i>
        </button>
        <button onClick={() => editBtnHandler(taskid)}>
          <i>Edit</i>
        </button>
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={() => deleteBtnHandler(taskid)}
          onCancel={cancelDelete}
          okText="Yes"
          cancelText="No"
        >
          <button>
            <i>Delete</i>
          </button>
        </Popconfirm>
      </div>
    </div>
  );
}

export default Task;
