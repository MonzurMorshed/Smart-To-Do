import React, { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import CategoryForm from './components/Category';
import ImportExport from './components/ImportExport';
import EditTaskModal from './components/EditTaskModal';
import { timeAgo } from './helpers/helpers';
import { BiSolidEdit } from "react-icons/bi";
import { MdDarkMode, MdDelete } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { listenTasks, addTask, updateTask, deleteTask, reorderTasks, setTasks } from './features/tasks/tasksSlice';
import { listenAuth } from './features/auth/authSlice';
import { listenCategories } from './features/categories/categoriesSlice';
import { useTranslation } from 'react-i18next';


export default function App() {

  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { user, loading } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);
  const { categories } = useSelector((state) => state.categories || ['All']);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [theme, setTheme] = useState(() => localStorage.getItem('smart-todo.theme') || 'light');
  const [sortBy, setSortBy] = useState('manual');
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('smart-todo.theme', theme);
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const filtered = useMemo(() => {
    let res = tasks.slice();
    if (query) {
      res = res.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          (t.notes || '').toLowerCase().includes(query.toLowerCase())
      );
    }
    if (categoryFilter !== 'All') {
      res = res.filter((t) => t.category === categoryFilter);
    }
    if (sortBy === 'due') {
      res.sort((a, b) => (a.due || Infinity) - (b.due || Infinity));
    }
    if (sortBy === 'priority') {
      const score = (p) => (p === 'High' ? 1 : p === 'Medium' ? 2 : 3);
      res.sort((a, b) => score(a.priority) - score(b.priority));
    }
    return res;
  }, [tasks, query, categoryFilter, sortBy]);

  const onDragStart = (e, idx) => e.dataTransfer.setData('text/plain', idx);
  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (isNaN(from)) return;
    dispatch(reorderTasks({ from, to: idx }));
  };

  useEffect(() => {
    dispatch(listenAuth());
  }, [dispatch]);
  
  useEffect(() => {
    if (!user) return;
    const unsubTasks = dispatch(listenTasks(user.uid));
    const unsubCategories = dispatch(listenCategories(user.uid));
    return () => {
      unsubTasks && unsubTasks();
      unsubCategories && unsubCategories();
    };
  }, [dispatch, user]);

  const handleDeleteTask = (user_id,task_id) => {
    dispatch(deleteTask(user_id,task_id));
    toast.success("Task delete from list successfully.");
  }

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
        <div className="relative">
          <button
            onClick={() => setTheme((th) => (th === 'dark' ? 'light' : 'dark'))}
            className="px-3 py-2 absolute right-0"
          >
            {theme === 'dark' ? <CiLight /> : <MdDarkMode />}
          </button>
          <select onChange={(e) => i18n.changeLanguage(e.target.value)} defaultValue={i18n.language} className="border p-1 rounded">
            <option value="en">En</option>
            <option value="es">Es</option>
            <option value="fr">Fr</option>
          </select>
        </div>

        {user ? (
          <div className="max-w-5xl mx-auto">
            
            <Header user={user} />

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <section className="md:col-span-1 space-y-4">

                {/* will popup form */}
                <CategoryForm user={user}/> 
                {/* emd */}

                {categories && <TaskForm categories={categories} onAdd={(task) => dispatch(addTask(user.uid, task))} />}

                <div className="glossy">
                  <label className="block mb-2 font-medium">{t('search')}</label>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className="w-full input"
                  />
                </div>

                <div className="glossy text-sm">
                  <strong>{t('tips_title')}</strong>
                  <ul className="mt-2 list-disc ml-5">
                    <li>{t('tip_1')}</li>
                    <li>{t('tip_2')}</li>
                    <li>{t('tip_3')}</li>
                  </ul>
                </div>
              </section>

              <section className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2 w-1/2 ">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full input"
                  >
                    <option>{t('all')}</option>
                    {categories && categories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input"
                  >
                    <option value="manual">{t('manual_order')}</option>
                    <option value="due">Sort by due date</option>
                    <option value="priority">Sort by priority</option>
                  </select>
                </div>

                <div className="glossy">
                  {filtered.length === 0 ? (
                    <p className="text-center py-10 text-muted">
                      No tasks yet — add one!
                    </p>
                  ) : (
                    <>
                      <div className="flex gap-2 mb-2">
                        <ImportExport
                          tasks={tasks}
                          setTasks={(t) => dispatch(setTasks(t))}
                        />
                      </div>

                      <ul className="space-y-3">
                        {filtered.map((val, idx) => (
                          <li
                            key={val.id}
                            draggable
                            onDragStart={(e) =>
                              onDragStart(e, tasks.findIndex((x) => x.id === val.id))
                            }
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => onDrop(e, idx)}
                            className={`p-3 rounded-lg border flex items-start justify-between gap-3`}
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={val.completed || false}
                                  onChange={() =>
                                    dispatch(
                                      updateTask({
                                        uid: user.uid,
                                        id: val.id,
                                        updates: { completed: !val.completed },
                                      })
                                    )
                                  }
                                  className="appearance-none h-5 w-5 rounded-full border-2 border-gray-300 checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                />
                                <div>
                                  <div
                                    className={`font-medium ${
                                      val.completed ? 'line-through opacity-60' : ''
                                    }`}
                                  >
                                    {val.title}
                                  </div>
                                  <div className="text-xs text-muted">
                                    {val.category} • {val.priority}{' '}
                                    {val.due
                                      ? '• due ' +
                                        new Date(val.due).toLocaleDateString()
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              {val.notes && (
                                <p className="mt-2 text-sm text-muted">
                                  {val.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditTask(val)}
                                  className={`editBtn flex items-center space-x-4`}
                                >
                                  <BiSolidEdit className="mr-2" />
                                  {t('edit')}
                                </button>
                                <button
                                  onClick={()=>handleDeleteTask(user.uid,val.id)}
                                  className={`deleteBtn flex items-center space-x-4`}
                                >
                                  <MdDelete className="mr-2" />
                                  {t('delete')}
                                </button>
                              </div>
                              <small className="text-xs text-muted">
                                {t('created')} {timeAgo(val.createdAt)}
                              </small>
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
              onSave={(updatedTask) =>
                dispatch(updateTask({ id: updatedTask.id, updates: updatedTask }))
              }
            />
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </>
  );
}
