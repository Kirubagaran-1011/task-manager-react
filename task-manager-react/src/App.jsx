import { useState, useEffect } from "react";

const STORAGE_KEY = "task-manager-tasks";

function App() {
  // Load saved tasks from localStorage on first render
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)));
    }
    setEditingId(null);
  };

  const clearCompleted = () => setTasks(tasks.filter((t) => !t.done));

  const visibleTasks = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="task-list">
        {visibleTasks.length === 0 && <p className="empty">No tasks here.</p>}
        {visibleTasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
            {editingId === task.id ? (
              <input
                className="edit-input"
                value={editText}
                autoFocus
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
              />
            ) : (
              <span onDoubleClick={() => startEdit(task)}>{task.text}</span>
            )}
            <button className="del" onClick={() => deleteTask(task.id)}>✕</button>
          </li>
        ))}
      </ul>

      <div className="footer">
        <span>{remaining} task(s) left</span>
        <button onClick={clearCompleted}>Clear completed</button>
      </div>
      <p className="hint">Tip: double-click a task to edit it.</p>
    </div>
  );
}

export default App;
