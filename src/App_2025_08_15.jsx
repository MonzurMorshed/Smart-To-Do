import React, { useEffect, useMemo, useState } from 'react'
import TaskForm from './components/TaskForm'
import { uid, timeAgo } from './helpers/helpers'
import EditTaskModal from './components/EditTaskModal'
import { BiSolidEdit } from "react-icons/bi";
import { MdDarkMode, MdDelete, MdOutlineLogout } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { Toaster } from "react-hot-toast";
import ImportExport from './components/ImportExport';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from './components/AuthForm';
import { listenAuth, logout } from './features/auth/authSlice';
import { FaUser } from 'react-icons/fa';

const defaultCategories = ['Work', 'Personal', 'Shopping', 'Other']

export default function App() {

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('smart-todo.tasks')
      return raw ? JSON.parse(raw) : []
    } catch (e) { return [] }
  })
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [theme, setTheme] = useState(() => localStorage.getItem('smart-todo.theme') || 'light')
  const [categories] = useState(defaultCategories)
  const [sortBy, setSortBy] = useState('manual')
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('smart-todo.tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('smart-todo.theme', theme)
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  const addTask = (t) => setTasks(prev => [{ id: uid(), ...t, createdAt: Date.now() }, ...prev])
  const updateTask = (id, updates) => setTasks(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  const removeTask = (id) => setTasks(prev => prev.filter(p => p.id !== id))

  const filtered = useMemo(() => {
    let res = tasks.slice()
    if (query) res = res.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || (t.notes || '').toLowerCase().includes(query.toLowerCase()))
    if (categoryFilter !== 'All') res = res.filter(t => t.category === categoryFilter)
    if (sortBy === 'due') res.sort((a, b) => (a.due || Infinity) - (b.due || Infinity))
    if (sortBy === 'priority') {
      const score = p => p === 'High' ? 1 : p === 'Medium' ? 2 : 3
      res.sort((a, b) => score(a.priority) - score(b.priority))
    }
    return res
  }, [tasks, query, categoryFilter, sortBy])

  // Simple drag handlers for manual reordering
  const onDragStart = (e, idx) => e.dataTransfer.setData('text/plain', idx)
  const onDrop = (e, idx) => {
    e.preventDefault()
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (isNaN(from)) return
    const copy = tasks.slice()
    const [moved] = copy.splice(from, 1)
    copy.splice(idx, 0, moved)
    setTasks(copy)
  }

  const handleLogout = async () => {
    dispatch(logout()); // Redux thunk
  };

  useEffect(() => {
    dispatch(listenAuth());
  }, [dispatch]);

  let userLogo = user ? user.email : '';
  const [avatarOpen, setAvatarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Smart To-Do List...</p>
      </div>
    );
  }


  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen p-4 transition-colors duration-300">
        <div className='relative'>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="px-3 py-2 absolute right-0">
            {theme === 'dark' ? <CiLight /> : <MdDarkMode />}
          </button>
        </div>
        {
          user ?
            <div className="max-w-5xl mx-auto">
              <header className="flex items-center justify-between mb-6">
                <div className="border-l-[5px] border-[#cbbfd5] pl-5">
                  <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
                    Smart To‑Do List
                  </h2>
                  <p className="text-sm font-medium text-body-color dark:text-dark-6">
                    Plan, track, and accomplish more with intelligent task management.<br />Turn ideas into action—quickly and efficiently.
                  </p>
                </div>

                <div className="relative inline-block text-left">
                  {/* Avatar Button */}
                  <button
                    onClick={() => setAvatarOpen(!avatarOpen)}
                    className="w-[60px] h-[60px] border-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold focus:outline-none"
                  >
                    {userLogo && userLogo.slice(0, 2).toUpperCase()}
                  </button>

                  {/* Dropdown Menu */}
                  {avatarOpen && (
                    <div className="absolute right-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                      <p className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center'>
                        <FaUser className='mr-2 w-10 h-10' /> {user.email}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                      >
                        <MdOutlineLogout className='mr-2 w-5 h-5' /> Logout
                      </button>
                    </div>
                  )}
                </div>

              </header>

              <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <section className="md:col-span-1 space-y-4">

                  <TaskForm categories={categories} onAdd={addTask} />

                  <div className="glossy">
                    <label className="block mb-2 font-medium">Search</label>
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks..." className="w-full input" />
                  </div>

                  <div className="glossy text-sm">
                    <strong>Tips</strong>
                    <ul className="mt-2 list-disc ml-5">
                      <li>Use priority tags to highlight important tasks.</li>
                      <li>Tasks are saved to localStorage automatically.</li>
                      <li>Drag items to reorder (manual mode).</li>
                    </ul>
                  </div>
                </section>

                <section className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2 w-1/2 ">
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full input">
                      <option>All</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input">
                      <option value="manual">Manual order</option>
                      <option value="due">Sort by due date</option>
                      <option value="priority">Sort by priority</option>
                    </select>
                  </div>

                  <div className="glossy">
                    {filtered.length === 0 ? (
                      <p className="text-center py-10 text-muted">No tasks yet — add one!</p>
                    ) : (
                      <>
                        <div className="flex gap-2 mb-2">
                          <ImportExport tasks={tasks} setTasks={setTasks} />
                        </div>

                        <ul className="space-y-3">
                          {filtered.map((t, idx) => (
                            <li key={t.id}
                              draggable
                              onDragStart={(e) => onDragStart(e, tasks.findIndex(x => x.id === t.id))}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => onDrop(e, idx)}
                              className="p-3 rounded-lg border flex items-start justify-between gap-3">

                              <div>
                                <div className="flex items-center gap-3">
                                  <input type="checkbox" checked={t.done || false} onChange={() => updateTask(t.id, { done: !t.done })} className='appearance-none h-5 w-5 rounded-full border-2 border-gray-300 checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition' />
                                  <div>
                                    <div className={`font-medium ${t.done ? 'line-through opacity-60' : ''}`}>{t.title}</div>
                                    <div className="text-xs text-muted">{t.category} • {t.priority} {t.due ? '• due ' + new Date(t.due).toLocaleDateString() : ''}</div>
                                  </div>
                                </div>
                                {t.notes && <p className="mt-2 text-sm text-muted">{t.notes}</p>}
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-2">
                                  <button onClick={() => setEditTask(t)} className={`editBtn flex items-center space-x-4`}>
                                    <BiSolidEdit className='mr-2' />
                                    Edit
                                  </button>
                                  <button onClick={() => removeTask(t.id)} className={`deleteBtn flex items-center space-x-4`}>
                                    <MdDelete className='mr-2' />
                                    Delete
                                  </button>
                                </div>
                                <small className="text-xs text-muted">Created {timeAgo(t.createdAt)}</small>
                              </div>

                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </section>
              </main>
              <EditTaskModal
                task={editTask}
                categories={categories}
                onClose={() => setEditTask(null)}
                onSave={(updatedTask) => updateTask(updatedTask.id, updatedTask)}
              />
            </div> : <AuthForm />
        }

      </div>
    </>

  )
}