import { useState } from "react"
import { IoIosSave } from "react-icons/io";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImCross } from "react-icons/im";
import { AiFillLike } from "react-icons/ai";
import { FaBrain } from "react-icons/fa";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_OPENAI_API_KEY);

async function suggestTaskTitle(task) {
  try {

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on the task "${task}", suggest 3 related sub-tasks or next steps. Provide the suggestions as a comma-separated list, and do not include any introductory phrases or explanations. For example: "Buy milk, eggs, bread"`;

    try {
      const { response } = await model.generateContent(prompt);
      
      const rawText = response.candidates[0].content.parts[0].text;

      const tasksArray = rawText
        .split(',')
        .map(task => task.trim())
        .filter(task => task.length > 0);

      return tasksArray;

    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return []; 
    }
  } catch (error) {
    console.error("AI Error:", error);
    return []; 
  }
}

export default function TaskForm({ categories, onAdd }) {

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState(categories[0]?.name || '')
  const [priority, setPriority] = useState('Medium')
  const [due, setDue] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState();
  const [loadingAI, setLoadingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { t } = useTranslation();

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Title required !");
      return false;
    }
    onAdd({ title: title.trim(), notes: notes.trim(), category, priority, due: due ? new Date(due).getTime() : null })
    setTitle(''); setNotes(''); setDue(''); setPriority('Medium'); setCategory(categories[0]?.name)
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
        console.error("AI Suggest error:", err);
      }
    } finally {
      setLoadingAI(false);
    }
  };
  // end

  return (
    <form onSubmit={submit} className="glossy">

      <label className="block font-medium mb-2">{t('add_task')}</label>

      <div className="flex gap-2 mb-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('task_title')} className={`flex-1 input px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition bg-white/70 dark:bg-gray-800/50 input`} />
        <button
          type="button"
          onClick={handleAISuggest}
          disabled={loadingAI}
          className="px-4 py-2 flex items-center rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow hover:opacity-90 transition"
        >
          <FaBrain className="mr-2" /> {loadingAI ? "Thinking..." : "AI Suggest"}
        </button>
      </div>

      {/* AI Suggestion Preview */}
      {showPreview && (
        <div className="mt-2 p-3 rounded-xl border border-indigo-200 
                  bg-white/80 dark:bg-gray-900/70 shadow-md">
          {loadingAI ? (
            <p className="text-sm text-gray-500 animate-pulse">
              ✨ Thinking of a task...
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
                  onClick={() => {setNotes(prev => prev + "\n" + aiSuggestion);setShowPreview(false)}}
                  className="px-3 py-1 rounded-md bg-purple-500 text-white text-xs flex items-center space-x-4"
                >
                  <AiFillLike className="mr-2"/>Use as Notes
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-4 px-3 py-1 rounded-md bg-gray-300 text-gray-700 text-xs"
                >
                  <ImCross className="mr-2"/> Dismiss
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('notes')} className={`w-full mt-2 input resize-none h-20`} />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <select value={category} onChange={e => setCategory(e.target.value)} className={`input`}>
          <option>{t('select_category')}</option>
          {categories && categories.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className={`input`}>
          <option>{t('select_priority')}</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="mt-2">
        <input value={due} onChange={e => setDue(e.target.value)} type="date" className={`input`} />
      </div>

      <div className="mt-3 flex justify-end">
        <button type="submit" className="saveBtn flex items-center justify-between">
          <IoIosSave className='mr-2' />{t('save')}</button>
      </div>
    </form>
  )
}