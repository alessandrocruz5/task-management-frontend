import React, { useCallback, useContext, useEffect, useState } from "react";
import { Task } from "../../interfaces/Task";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { useNavigate } from "react-router-dom";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:5000/api/tasks";

  const fetchTasks = useCallback(async () => {
    if (!auth?.user?.token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ data: Task[] }>(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });

      setTasks(response.data.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [auth?.user?.token, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback((newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  }, []);

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        await axios.delete(`${apiUrl}/${taskId}`, {
          headers: { Authorization: `Bearer ${auth?.user?.token}` },
        });

        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      } catch (err) {
        console.error("Error deleting task: ", err);
        setError("Failed to delete task. Please try again.");
      }
    },
    [auth?.user?.token]
  );

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Tasks</h2>
      <TaskForm onAddTask={addTask} />
      {tasks.length === 0 ? (
        <p>No tasks found. Add a new task using the form above.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
