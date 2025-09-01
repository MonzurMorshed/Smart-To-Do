import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdDarkMode, MdOutlineLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import i18n from "../utility/i18n";
import { CiLight } from "react-icons/ci";

const Header = ({ user }) => {

    const [avatarOpen, setAvatarOpen] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    let userLogo = user ? user.email : '';
    const [theme, setTheme] = useState(() => localStorage.getItem('smart-todo.theme') || 'light');

    useEffect(() => {
        localStorage.setItem('smart-todo.theme', theme);
        document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    }, [theme]);



    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="mb-6">

            <div className="flex items-center justify-between ">
                <img src='./public/logo.png' className='w-[140px] sm:w-[140px] md:w-[250px]' />
                <div className="relative inline-block text-left">

                    <div className="flex items-center justify-between gap-1">

                        <select onChange={(e) => i18n.changeLanguage(e.target.value)} defaultValue={i18n.language} className="border p-1 rounded">
                            <option value="en">En</option>
                            <option value="es">Es</option>
                            <option value="fr">Fr</option>
                        </select>

                        <button
                            onClick={() => setTheme((th) => (th === 'dark' ? 'light' : 'dark'))}
                            className="px-3 py-2"
                        >
                            {theme === 'dark' ? <CiLight /> : <MdDarkMode />}
                        </button>

                        <button
                            onClick={() => setAvatarOpen(!avatarOpen)}
                            className="md:w-[50px] md:h-[50px] w-[30px] h-[30px] border-2 text-[14px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white md:text-md sm:text-sm  font-bold focus:outline-none"
                        >
                            {userLogo && userLogo.slice(0, 2).toUpperCase()}
                        </button>

                    </div>

                    {avatarOpen && (
                        <div className="absolute right-0 mt-2 w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                            <p className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                                <FaUserAlt className="mr-2 size-5" /> {user.email}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                            >
                                <MdOutlineLogout className="mr-2 w-5 h-5" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <div className="border-l-[5px] border-[#cbbfd5] pl-5">
                <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
                    {t('app_title')}
                </h2>
                <p className="text-sm font-medium text-body-color dark:text-dark-6">
                    {t('app_subtitle')}
                </p>
            </div>
        </header>
    )
}

export default Header;