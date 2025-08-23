import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../firebase/firestoreService";
import { IoIosAddCircle } from "react-icons/io";

export default function CategoryForm(props) {
    const [name, setName] = useState("");
    const dispatch = useDispatch();

    const { user } = props;

    const handleSubmit = (e) => {

        e.preventDefault();
        if (!name.trim()) return;
        const docRef = addCategory(user.uid, name);
        dispatch({ type: 'categories/add', payload: { id: docRef.id, name } });
        setName("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow glossy"
        >
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New category..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
                <IoIosAddCircle className="mr-2"/>Add
            </button>
        </form>
    );
}
