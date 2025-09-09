import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryForm from '../features/categories/components/CategoryForm';
import TaskForm from '../features/tasks/components/TaskForm';
import TaskList from '../features/tasks/components/TaskList';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const MainComponent = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user, loading } = useSelector((state) => state.auth);
    const { categories } = useSelector((state) => state.categories || ['All']);
    const { tasks } = useSelector((state) => state.tasks);

    const [task, setTask] = useState(tasks[0]?.name || '')

    return (
        <div className="mx-auto">

            <Header user={user} />

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6 px-[25px] md:px-[45px]">
                <section className="md:col-span-1 space-y-4">

                    <CategoryForm user={user} />

                    {categories && <TaskForm categories={categories} user={user} />}

                    <div className="glossy text-md dark:text-white">
                        <strong>{t('tips_title')}</strong>
                        <ul className="mt-2 list-disc ml-5">
                            <li>{t('tip_1')}</li>
                            <li>{t('tip_2')}</li>
                            <li>{t('tip_3')}</li>
                        </ul>
                    </div>
                </section>

                <TaskList user={user} />

            </main>


        </div>
    );
}

export default MainComponent;