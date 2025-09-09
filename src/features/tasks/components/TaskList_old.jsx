import toast from "react-hot-toast";
import { BiSolidEdit } from "react-icons/bi"
import { MdDelete } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, listenTasks, reorderTasks, updateTask } from "../tasksSlice";
import { listenCategories } from "../../categories/categoriesSlice";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ImportExport from "../../../components/ImportExport";
import { timeAgo } from "../../../helpers/helpers";
import EditTaskModal from "./EditTaskModal";
import SelectInput from "../../../components/SelectInput";

const TaskList = ({ user }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [query, setQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Manual');
    const [editTask, setEditTask] = useState(null);

    const { tasks } = useSelector((state) => state.tasks);
    const { categories } = useSelector((state) => state.categories || ['All']);

    const categoryOptions = [
        { value: "All", label: t("all") },
        ...(categories || []).map((c) => ({
            value: c.id,
            label: c.name
        }))
    ];

    const selectedCategoryOption = categoryOptions.find(opt => opt.label === categoryFilter || opt.value === categoryFilter);

    const [sortFilter, setSortFilter] = useState('Manual');

    const sortOptions = [
        { value: "manual", label: t("manual_order") },
        { value: "due", label: t("sort_by_due_date") },
        { value: "priority", label: t("sort_by_priority") }
    ];

    const selectedSortOption = sortOptions.find(opt => opt.label === sortFilter || opt.value === sortFilter);

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

    const handleDeleteTask = (user_id, task_id) => {
        dispatch(deleteTask(user_id, task_id));
        toast.success("Task delete from list successfully.");
    }

    const markAsRead = (uid, val) => {

        if(val.completed == false) toast.success('Task is completed.')
        else if(val.completed == true) toast.error('Task is not completed.')
        
        const payload = {
            uid: uid,
            id: val.id,
            updates: { completed: !val.completed },
        };

        dispatch(updateTask(payload));
    }

    useEffect(() => {
        const unsubTasks = dispatch(listenTasks(user.uid));
        const unsubCategories = dispatch(listenCategories(user.uid));
        return () => {
            unsubTasks && unsubTasks();
            unsubCategories && unsubCategories();
        };
    }, [dispatch]);

    return (
        <section className="md:col-span-2">
            <div className="glossy flex items-center gap-2 mb-2 w-full">

                <SelectInput setFilter={setCategoryFilter} options={categoryOptions} selectedOptions={selectedCategoryOption} t={t} />

                <SelectInput setFilter={setSortBy} options={sortOptions} selectedOptions={selectedSortOption} t={t} />

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className="w-full input"
                />
            </div>

            <div className="glossy">
                {filtered.length === 0 ? (
                    <p className="text-center py-10 text-muted">
                        {t('no_tasks_yet_add_one')}
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
                                    className={`p-3 rounded-lg border md:flex md:items-start md:justify-between gap-3 xs:w-full md:pb-4`}
                                >
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={val.completed || false}
                                                onChange={() => markAsRead(user.uid, val)}
                                                className="appearance-none h-5 w-5 rounded-full border-2 border-gray-300 checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                            />
                                            <div>
                                                <div
                                                    className={`font-medium ${val.completed ? 'line-through opacity-60' : ''
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

                                    <div className="flex flex-col md:items-end gap-2 mt-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditTask(val)}
                                                className={`editBtn flex items-center space-x-4`}
                                            >
                                                <BiSolidEdit className="mr-2" />
                                                {t('edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(user.uid, val.id)}
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

            <EditTaskModal
                task={editTask}
                categories={categories}
                onClose={() => setEditTask(null)}
                onSave={(updatedTask) =>
                    dispatch(updateTask({ uid: user.uid, id: updatedTask.id, updates: updatedTask }))
                }
            />
        </section>
    )
}

export default TaskList;