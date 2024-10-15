import React from "react";
import "../tasks.css";
import plus from "../assets/add.svg";
import dots from "../assets/3 dot menu.svg";
import TaskCard from "./TaskCard";
import { getColorForUser, getInitials, normalizeStatus } from "../utils";
import rgent from "../assets/SVG - Urgent Priority colour.svg";
import highpriorityIcon from "../assets/Img - High Priority.svg";
import todoimage from "../assets/To-do.svg";
import urgentpriorityIcon from "../assets/in-progress.svg";
import doneIcon from "../assets/Done.svg";
import progressIcon from "../assets/in-progress.svg";
import backlogIcon from "../assets/Backlog.svg";
import nopriorityIcon from "../assets/No-priority.svg";
import lowPriorityIcon from "../assets/Img - Low Priority.svg";
import mediumpriorityIcon from "../assets/Img - Medium Priority.svg";
import cancledIcon from "../assets/Cancelled.svg";

function TaskPage({ tickets, users, view, ordering }) {
  const statusArray = ["Backlog", "Todo", "In progress", "Done", "Cancelled"];
  const priorityArray = ["No priority", "Urgent", "High", "Medium", "Low"];
  const priorityindex = ["No priority", "Low", "Medium", "High", "Urgent"];

  const statusIconMap = {
    todo: todoimage,
    in_progress: progressIcon,
    backlog: backlogIcon,
    done: doneIcon,
    cancelled: cancledIcon,
  };

  const priorityMap = {
    no_priority: nopriorityIcon,
    low: lowPriorityIcon,
    medium: mediumpriorityIcon,
    high: highpriorityIcon,
    urgent: urgentpriorityIcon,
  };

  const groupTasks = (tickets, view) => {
    let viewArray;

    if (view === "status") {
      viewArray = statusArray;
    } else if (view === "priority") {
      viewArray = priorityArray;
    } else {
      viewArray = [];
    }

    const groupedTasks = viewArray.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    tickets.forEach((task) => {
      const key =
        view === "user"
          ? users.find((user) => user.id === task.userId)?.name || "User Name"
          : view === "priority"
          ? priorityindex[task.priority] // Use the task's priority index directly
          : task[view];

      if (!groupedTasks[key]) {
        groupedTasks[key] = [];
      }
      groupedTasks[key].push(task);
    });

    return groupedTasks;
  };

  const sortTasks = (grouptedTasks) => {
    const sortedGroups = {};
    Object.entries(groupedTasks).forEach(([key, tasks]) => {
      const sortedTasks = tasks.sort((a, b) => {
        if (ordering === "priority") {
          return b.priority - a.priority;
        } else {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
      sortedGroups[key] = sortedTasks;
    });
    return sortedGroups;
  };

  const groupedTasks = groupTasks(tickets, view);
  const sortedTasks = sortTasks(groupedTasks);

  return (
    <div className="tasksection">
      {Object.entries(sortedTasks).map(([key, tasks]) => (
        <div key={key} className="tasktype">
          <div className="type-heading">
            {view === "user"
              ? (() => {
                  const user = users.find((u) => u.name === key);
                  const name = getInitials(user?.name) || "Na";
                  const color =
                    getColorForUser(user?.id[user.id.length - 1]) || "#000";

                  return (
                    <div className="task-type-name">
                      <div
                        className="profile"
                        style={{ backgroundColor: color }}
                      >
                        {name}
                        <div className="indicator"></div>
                      </div>
                      <p>{key}</p>
                      <p>{tasks.length}</p>
                    </div>
                  );
                })()
              : view === "priority"
              ? (() => {
                  const icon = priorityMap[normalizeStatus(key)];
                  return (
                    <div className="task-type-name">
                      <img src={icon} alt="priority icon" className="icon" />
                      <p>{key}</p>
                      <p>{tasks.length}</p>
                    </div>
                  );
                })()
              : view === "status"
              ? (() => {
                  const icon = statusIconMap[normalizeStatus(key)]; // Use the status map to get the icon
                  return (
                    <div className="task-type-name">
                      <img src={icon} alt="status icon" className="icon" />
                      <p>{key}</p>
                      <p>{tasks.length}</p>
                    </div>
                  );
                })()
              : null}

            <div className="icons">
              <img src={plus} alt="Add task" />
              <img src={dots} alt="Options" />
            </div>
          </div>
          <ul className="tasklist">
            {tasks.map((task) => {
              const user = users.find((u) => u.id === task.userId);
              return (
                <TaskCard task={task} key={task.id} user={user} view={view} />
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TaskPage;
