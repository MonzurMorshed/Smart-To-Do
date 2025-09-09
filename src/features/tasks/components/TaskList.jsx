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
import Pagination from "../../../components/Pagination";

export default function TaskList({ user }) {

    const [activeTab, setActiveTab] = useState("incompleted");
    const [pageState, setPageState] = useState({ incompleted: 1, completed: 1 });
    const tasksPerPage = 5;

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

        if (val.completed == false) toast.success('Task is completed.')
        else if (val.completed == true) toast.error('Task is not completed.')

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

    const filterTask = useMemo(() => {
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

    const incompletedTasks = filterTask.filter((t) => !t.completed);
    const completedTasks = filterTask.filter((t) => t.completed);

    const selectedTasks =
        activeTab === "incompleted" ? incompletedTasks : completedTasks;

    const currentPage = pageState[activeTab];
    const totalPages = Math.ceil(selectedTasks.length / tasksPerPage);

    const startIndex = (currentPage - 1) * tasksPerPage;

    const paginatedTasks = selectedTasks.slice(
        startIndex,
        startIndex + tasksPerPage
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handlePageChange = (page) => {
        setPageState((prev) => ({ ...prev, [activeTab]: page }));
    };

    return (

        <section className="md:col-span-2">
            <div className="glossy flex items-center gap-2 mb-2 w-full">

                <SelectInput className="input" setFilter={setCategoryFilter} options={categoryOptions} selectedOptions={selectedCategoryOption} t={t} />

                <SelectInput setFilter={setSortBy} options={sortOptions} selectedOptions={selectedSortOption} t={t} />

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className="w-full input"
                />
            </div>

            <div className="glossy">
                {/* Tabs */}
                <div className="flex gap-6 mb-4 border-b border-[var(--border)]">
                    <button
                        onClick={() => handleTabChange("incompleted")}
                        className={`pb-2 font-medium flex items-center gap-2 ${activeTab === "incompleted"
                            ? "border-b-2 border-[var(--primary)] bg-[var(--primary)] text-white font-semibold"
                            : "border-[var(--muted)] bg-[var(--muted)] hover:bg-[var(--muted)] text-[#000]"
                            }`}
                    >

                        {t("incompleted")}{" "}
                        <span className="text-xs bg-[var(--primary)] text-white rounded-full px-2 border-2">
                            {incompletedTasks.length}
                        </span>
                    </button>

                    <button
                        onClick={() => handleTabChange("completed")}
                        className={`pb-2 font-medium flex items-center gap-2 ${activeTab === "completed"
                            ? "border-b-2 border-[var(--primary)] bg-[var(--primary)] text-white font-semibold"
                            : "border-[var(--muted)] bg-[var(--muted)] hover:bg-[var(--muted)] text-[#000]"
                            }`}
                    >
                        {t("completed")}{" "}
                        <span className="text-xs bg-[var(--primary)] text-white rounded-full px-2 border-2">
                            {completedTasks.length}
                        </span>
                    </button>
                </div>

                {/* Task List */}
                {paginatedTasks.length === 0 ? (
                    <p className="text-center py-10 text-[var(--muted)]">
                        {activeTab === "incompleted" ? t("incompleted") : t("completed")}
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
                            {paginatedTasks.map((task, idx) => (
                                <li
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) =>
                                        onDragStart(e, tasks.findIndex((x) => x.id === task.id))
                                    }
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, idx)}
                                    className="p-3 rounded-lg border flex flex-col md:flex-row md:items-start md:justify-between gap-3 bg-[var(--card)] font-semibold"
                                >
                                    {/* Left side: task content */}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={task.completed || false}
                                                onChange={() => markAsRead(user.uid, task)}
                                                className="appearance-none h-5 w-5 rounded-full border-2 border-[var(--border)] checked:bg-[var(--primary)] checked:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                                            />
                                            <div>
                                                <div className="font-semibold">
                                                    {task.title}
                                                </div>
                                                <div className="text-sm font-semibold text-[var(--muted)]">
                                                    {task.category} • {task.priority}{" "}
                                                    {task.due
                                                        ? "• " + new Date(task.due).toLocaleDateString()
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                        {task.notes && (
                                            <p className="text-md font-semibold mt-2 text-[var(--muted)]">{task.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditTask(task)}
                                                className="space-x-1"
                                            >
                                                <BiSolidEdit/> {t("edit")}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(user.uid, task.id)}
                                                className="space-x-1"
                                            >
                                                <MdDelete/> {t("delete")}
                                            </button>
                                        </div>
                                        <small className="text-xs text-[var(--muted)]">
                                            {t("created")} {timeAgo(task.createdAt)}
                                        </small>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <EditTaskModal
                    task={editTask}
                    categories={categories}
                    onClose={() => setEditTask(null)}
                    onSave={(updatedTask) =>
                        dispatch(updateTask({ uid: user.uid, id: updatedTask.id, updates: updatedTask }))
                    }
                />
            </div>
        </section>
    );
}
