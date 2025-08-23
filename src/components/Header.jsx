import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useTranslation } from "react-i18next";

const Header = ({user}) => {

    const [avatarOpen, setAvatarOpen] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    let userLogo = user ? user.email : '';

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="flex items-center justify-between mb-6">
            <div className="border-l-[5px] border-[#cbbfd5] pl-5">
                <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
                    {t('app_title')}
                </h2>
                <p className="text-sm font-medium text-body-color dark:text-dark-6">
                    {t('app_subtitle')}
                </p>
            </div>

            <div className="relative inline-block text-left">
                <button
                    onClick={() => setAvatarOpen(!avatarOpen)}
                    className="w-[60px] h-[60px] border-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold focus:outline-none"
                >
                    {userLogo && userLogo.slice(0, 2).toUpperCase()}
                </button>

                {avatarOpen && (
                    <div className="absolute right-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                        <p className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                            <FaUser className="mr-2 w-10 h-10" /> {user.email}
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
        </header>
    )
}

export default Header;