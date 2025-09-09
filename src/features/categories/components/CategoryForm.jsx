import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../firebase/firestoreService";
import { IoIosAddCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

export default function CategoryForm(props) {

    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { user } = props;

    const handleSubmit = (e) => {

        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter name of the task.");
            return false;
        };
        const docRef = addCategory(user.uid, name);
        dispatch({ type: 'categories/add', payload: { id: docRef.id, name } });
        setName("");
        toast.success('Category successfully added.');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full p-3 bg-white dark:bg-gray-800 shadow glossy space-y-4"
        >
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("new_category")}
                className="w-full flex-1 px-3 py-2 input dark:bg-gray-700 dark:text-white"
            />
            <button
                type="submit"
            >
                <IoIosAddCircle className="mr-2"/>{t('add')}
            </button>
        </form>
    );
}
