import { useState } from "react"
import { IoIosSave } from "react-icons/io";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImCross } from "react-icons/im";
import { AiFillLike } from "react-icons/ai";
import { FaBrain } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addTask } from "../tasksSlice";
import SelectInput from "../../../components/SelectInput";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_OPENAI_API_KEY);

async function suggestTaskTitle(task) {
  try {

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on the task "${task}", suggest 5 related sub-tasks or next steps. Provide the suggestions as ordered list, and do not include any introductory phrases or explanations. For example: "Buy milk, eggs, bread"`;

    try {
      const { response } = await model.generateContent(prompt);

      const rawText = response.candidates[0].content.parts[0].text;

      const tasksArray = rawText
        .split(', ')
        .map(task => task.trim())
        .filter(task => task.length > 0);

      return tasksArray;

    } catch (error) {
      console.error("Error parsing response:", error);
      return [];
    }
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}

export default function TaskForm({ categories, user }) {

  const dispatch = useDispatch();
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [due, setDue] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState();
  const [loadingAI, setLoadingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { t } = useTranslation();

  const categoryOptions = [
    { value: "", label: t("select_category") },
    ...(categories || []).map((c) => ({
      value: c.id,
      label: c.name
    }))
  ];

  const selectedCategoryOption = categoryOptions.find(opt => opt.label === category || opt.value === category);

  const priorityOptions = [
    { value: "", label: t('select_priority') },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const selectedPriorityOption = priorityOptions.find(opt => opt.label === priority || opt.value === priority);

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter title of the task.");
      return false;
    }

    const task = { title: title.trim(), notes: notes.trim(), category, priority, due: due ? new Date(due).getTime() : null };
    dispatch(addTask(user.uid, task))
    setTitle(''); setNotes(''); setDue(''); setPriority(''); setCategory('')
    toast.success('Task successfully added your list.');
  }

  const handleAISuggest = async () => {
    if (!title) return;
    setLoadingAI(true);
    setShowPreview(true);
    setAiSuggestion("");
    try {
      const suggestion = await suggestTaskTitle(title);
      setAiSuggestion(suggestion || "AI could not generate a task.");
    } catch (err) {
      if (err.status === 429) {
        toast.error("You’ve hit your  quota. Please check your billing.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <form onSubmit={submit} className="glossy">

      <label className="block font-medium mb-2">{t('add_task')}</label>

      <div className="block gap-2 mb-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('task_title')} className={`input`} />
        <button
          type="button"
          onClick={handleAISuggest}
          disabled={loadingAI}
        >
          <FaBrain className="mr-2" /> {loadingAI ? t('thinking') : t('ai_suggest')}
        </button>
      </div>

      {showPreview && (
        <div className="mt-2 p-3 rounded-xl border border-indigo-200 
                  bg-white/80 dark:bg-gray-900/70 shadow-md">
          {loadingAI ? (
            <p className="text-sm text-gray-500 animate-pulse">
              ✨ {t('thinking_of_a_task')} ...
            </p>
          ) : (
            <>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                {aiSuggestion.map((s, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-200">
                    {s}
                  </li>))}
              </ul>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setNotes(prev => prev + "\n" + aiSuggestion); setShowPreview(false) }}
                  className="px-3 py-1 rounded-md bg-purple-500 text-white text-xs flex items-center space-x-4"
                >
                  <AiFillLike className="mr-2" />Use as Notes
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-4 px-3 py-1 rounded-md bg-gray-300 text-gray-700 text-xs"
                >
                  <ImCross className="mr-2" /> Dismiss
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('notes')} className={`w-full mt-2 input border-[20px] resize-none h-30`} />


      <div className="grid grid-cols-2 gap-2 mt-2">

        <SelectInput setFilter={setCategory} options={categoryOptions} selectedOptions={selectedCategoryOption} t={t} />

        <SelectInput setFilter={setPriority} options={priorityOptions} selectedOptions={selectedPriorityOption} t={t} />

      </div>

      <div className="mt-2">
        <input value={due} onChange={e => setDue(e.target.value)} type="date" className={`input`} />
      </div>

      <div className="mt-3 flex justify-end">
        <button type="submit">
          <IoIosSave className='mr-2' />{t('save')}</button>
      </div>
    </form>
  )
}