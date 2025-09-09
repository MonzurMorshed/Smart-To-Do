import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { GiCancel } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SelectInput from '../../../components/SelectInput';

export default function EditTaskModal({ task, categories, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState('Medium');
  const [due, setDue] = useState('');
  const { t } = useTranslation();

  const categoryOptions = [
    { value: "All", label: t("all") },
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

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || '');
    setNotes(task.notes || '');
    setCategory(task.category || categories[0]);
    setPriority(task.priority || 'Medium');
    setDue(task.due ? new Date(task.due).toISOString().slice(0, 10) : '');
  }, [task, categories]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter title of the task');
      return false;
    }
    onSave({
      ...task,
      title: title.trim(),
      notes: notes.trim(),
      category,
      priority,
      due: due ? new Date(due).getTime() : null,
    });
    onClose();
    toast.success('Task updated successfully.');
  };

  if (!task) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4 dark:text-dark text-center">Update Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input mb-3"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          autoFocus
        />
        <textarea
          className="input mb-3 h-20 resize-none"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />
        <div className="grid grid-cols-2 gap-2 mb-3">

          <SelectInput setFilter={setCategory} options={categoryOptions} selectedOptions={selectedCategoryOption} t={t} />

          <SelectInput setFilter={setPriority} options={priorityOptions} selectedOptions={selectedPriorityOption} t={t} />

        </div>
        <input
          className="input mb-3"
          type="date"
          value={due}
          onChange={e => setDue(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-700 hover:bg-red-800 flex items-center justify-between"
          >
            <GiCancel className='mr-2' />
            Cancel
          </button>
          <button type="submit" className="flex items-center justify-between">
            <FaRegEdit className='mr-2' />
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
