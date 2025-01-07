 import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState(""); 
  const [priority, setPriority] = useState("Medium");
  const [burstTime, setBurstTime] = useState(5); 

  useEffect(() => {
    
    const interval = setInterval(() => {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];

        
        const runningTaskIndex = updatedTasks.findIndex(
          (task) => task.state === "Running"
        );

        if (runningTaskIndex !== -1) {
          updatedTasks[runningTaskIndex].progress += 1;
          if (
            updatedTasks[runningTaskIndex].progress >=
            updatedTasks[runningTaskIndex].burstTime
          ) {
            updatedTasks[runningTaskIndex].state = "Terminated";
          }
        } else {
          const waitingTaskIndex = updatedTasks.findIndex(
            (task) => task.state === "Waiting"
          );
          if (waitingTaskIndex !== -1) {
            updatedTasks[waitingTaskIndex].state = "Running";
          }
        }

        return updatedTasks;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    
    const newTask = {
      id: tasks.length + 1,
      name: taskName,
      priority,
      burstTime: parseInt(burstTime),
      progress: 0,
      state: "Waiting",
    };
    setTasks((prev) =>
      [...prev, newTask].sort(
        (a, b) => priorityLevel(b.priority) - priorityLevel(a.priority)
      )
    );
    setTaskName("");
    setBurstTime(5);
    setPriority("Medium");
  };

  const priorityLevel = (level) => {
    switch (level) {
      case "High":
        return 3;
      case "Medium":
        return 2;
      case "Low":
        return 1;
      default:
        return 0;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Priority-Based Task Manager Simulator</h1>
        <div className="task-form">
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="number"
            placeholder="Burst Time"
            value={burstTime}
            onChange={(e) => setBurstTime(e.target.value)}
            min="1"
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        <div className="task-list">
          <h2>Task List</h2>
          {tasks.map((task) => (
            <div key={task.id} className={`task ${task.state.toLowerCase()}`}>
              <h3>{task.name}</h3>
              <p>Priority: {task.priority}</p>
              <p>Burst Time: {task.burstTime}</p>
              <p>
                Progress: {task.progress}/{task.burstTime}
              </p>
              <p>State: {task.state}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
