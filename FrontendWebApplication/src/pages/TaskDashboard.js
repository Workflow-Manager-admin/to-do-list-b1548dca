import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import * as api from "../api";
import { useNotification } from "../NotificationContext";

/**
 * PUBLIC_INTERFACE
 * TaskDashboard displays, creates, updates, deletes, and filters to-do tasks.
 * Supports accessibility, keyboard navigation, and live feedback.
 */
export default function TaskDashboard() {
  const { token } = useAuth();
  const { notify } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .fetchTasks(token)
      .then((data) => mounted && setTasks(data.tasks || []))
      .catch((e) => notify("Failed to load tasks: " + e.message))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
    // eslint-disable-next-line
  }, [token]);

  async function handleTaskCreate(e) {
    e.preventDefault();
    if (!form.title) return notify("Task title required");
    try {
      const newTask = await api.createTask(token, form);
      setTasks((tasks) => [newTask, ...tasks]);
      setForm({ title: "", description: "" });
      notify("Task created!");
    } catch (e) {
      notify("Task not created: " + e.message);
    }
  }

  function handleTaskEditStart(task) {
    setEditId(task.id);
    setForm({ title: task.title, description: task.description });
  }

  async function handleTaskEditSave(e) {
    e.preventDefault();
    try {
      const upd = await api.updateTask(token, editId, form);
      setTasks((tasks) =>
        tasks.map((t) => (t.id === upd.id ? upd : t))
      );
      setEditId(null);
      setForm({ title: "", description: "" });
      notify("Task updated!");
    } catch (e) {
      notify("Edit failed: " + e.message);
    }
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm({ title: "", description: "" });
  }

  async function handleTaskDelete(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this task? This cannot be undone."
      )
    )
      return;
    try {
      await api.deleteTask(token, id);
      setTasks((tasks) => tasks.filter((t) => t.id !== id));
      notify("Task deleted.");
    } catch (e) {
      notify("Delete failed: " + e.message);
    }
  }

  const filtered = filter
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(filter.toLowerCase()) ||
          (t.description &&
            t.description.toLowerCase().includes(filter.toLowerCase()))
      )
    : tasks;

  return (
    <section aria-label="Tasks Dashboard" style={{ width: "100%", maxWidth: 600 }}>
      <h1 tabIndex={0}>Task Dashboard</h1>
      <form
        onSubmit={editId ? handleTaskEditSave : handleTaskCreate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: "1em",
          marginBottom: "2em",
          background: "var(--bg-secondary)",
        }}
        aria-label={editId ? "Edit Task Form" : "Create Task Form"}
      >
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          maxLength={100}
          style={{ padding: "0.5em" }}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          style={{ padding: "0.5em" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn"
            type="submit"
            style={{ flex: 1 }}
            aria-label={editId ? "Save Task" : "Create Task"}
            disabled={loading}
          >
            {editId ? "Save" : "Add Task"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn"
              style={{ background: "#888" }}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div
        aria-label="Task Filter"
        style={{
          marginBottom: "1em",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <input
          aria-label="Filter Tasks"
          placeholder="Filter by title/description..."
          style={{ padding: "0.5em", flex: 1 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span style={{ fontWeight: 500 }}>
          {filtered.length} {filtered.length === 1 ? "task" : "tasks"}
        </span>
      </div>
      <ul
        aria-live="polite"
        tabIndex={0}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {loading && <li>Loading tasks...</li>}
        {!loading && filtered.length === 0 && (
          <li>No tasks found. Start by creating a task.</li>
        )}
        {filtered.map((task) => (
          <li
            key={task.id}
            tabIndex={0}
            style={{
              border: "1px solid var(--border-color)",
              borderRadius: 8,
              marginBottom: 10,
              background: "var(--bg-secondary)",
              padding: "1em",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
            aria-label={`Task: ${task.title}`}
          >
            <div style={{ fontSize: "1.1em", fontWeight: 600 }}>
              {task.title}
            </div>
            <div style={{ color: "#666", marginBottom: 8 }}>
              {task.description}
            </div>
            <div style={{ display: "flex", gap: "1em" }}>
              <button
                className="btn"
                aria-label="Edit"
                onClick={() => handleTaskEditStart(task)}
                style={{
                  background: "#44aaff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Edit
              </button>
              <button
                className="btn"
                aria-label="Delete"
                onClick={() => handleTaskDelete(task.id)}
                style={{
                  background: "#bb2222",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
