import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { GiCancel } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import toast from 'react-hot-toast';

export default function EditTaskModal({ task, categories, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState('Medium');
  const [due, setDue] = useState('');

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
      toast.error('Please enter title');
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
    toast.success('Task edited successfully.');
  };

  if (!task) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4 dark:text-dark">Update Task</h2>
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
          <select
            className="input"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            className="input"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
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
            className="deleteBtn flex items-center justify-between"
          >
            <GiCancel className='mr-2'/>
            Cancel
          </button>
          <button type="submit" className="saveBtn flex items-center justify-between">
            <FaRegEdit className='mr-2'/>
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
