import {useEffect, useState} from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Button from '../components/Button';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('ALL');

  async function fetchTasks() {
    setLoading(true);
    setError('');
    try{
      const params = filter === 'ALL' ? {} : { status: filter };
      const res = await api.get('/tasks', { params });
      setTasks(res.data.data);
    }catch (err) {
      setError('Could not load tasks. Please try again.');
    }finally{
      setLoading(false);
    }
  }

  // Fetch tasks whenever the filter changes
  useEffect(() => {
    fetchTasks();
  }, [filter]);

  async function handleCreateOrUpdate(values) {
    if (editingTask) {
      const res = await api.put(`/tasks/${editingTask.id}`, values);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data.data : t)));
    } else {
      const res = await api.post('/tasks', values);
      setTasks((prev) => [res.data.data, ...prev]);
    }
    setShowForm(false);
    setEditingTask(null);
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    await api.delete(`/tasks/${task.id}`);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  async function handleToggleStatus(task) {
    const newStatus = task.status === 'DONE' ?'PENDING':'DONE';
    const res = await api.put(`/tasks/${task.id}`, { status: newStatus });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data.data : t)));
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-sm font-medium text-brand-500">Your workspace</p>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">Your tasks</h1>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm((s) => !s);
            }}
          >
            {showForm && !editingTask ?'Close':'+ New task'}
          </Button>
        </div>

        <div className="flex gap-2 mb-6 rounded-2xl border border-stone-800 bg-stone-900/70 p-2 w-fit">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'DONE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full border ${
                filter === f
                  ? 'bg-brand-500 text-stone-950 border-brand-500 shadow-sm shadow-amber-950/40'
                  : 'border-transparent bg-transparent text-stone-400 hover:bg-stone-800 hover:text-brand-100'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="mb-6">
            <TaskForm
              initialTask={editingTask}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {loading && <p className="text-sm text-gray-500">Loading tasks…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="text-sm text-gray-500">No tasks yet. Create your first one above.</p>
        )}

        <div className="grid gap-3 sm:grid-cols-1">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onEdit={(t) => {
                setEditingTask(t);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}