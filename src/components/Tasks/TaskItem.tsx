import React, { useContext, useState } from "react";
import { Task } from "../../interfaces/Task";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

interface TaskItemProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const apiUrl = "http://localhost:5000/api/tasks";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${task._id}`, editedTask, {
        headers: {
          Authorization: `Bearer ${auth?.user?.token}`,
          "Content-Type": "application/json",
        },
      });

      onUpdateTask(response.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task: ", err);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      onDeleteTask(task._id);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleChange}
          required
        />
        <select name="status" value={editedTask.status} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={editedTask.dueDate.split("T")[0]}
          onChange={handleChange}
          required
        />
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
        {error && <p>{error}</p>}
      </form>
    );
  }

  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default TaskItem;
