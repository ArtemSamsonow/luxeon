import { Link } from "react-router-dom";
import { Logo } from "@shared";
import { Icon } from "@iconify/react";

/**
 * Подвал сайта, по совместительству отображаются избранные города
 */
export const Footer = () => {
    return (
        <footer className="w-full border-t-1 py-6 mt-auto">
            <div className="max-w-[1440px] m-auto px-4 flex flex-col md:flex-row justify-between items-start gap-6">
                {/* Логотип + краткое описание */}
                <div className="flex flex-col items-start gap-3">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={Logo} alt="Логотип" className="w-24 h-16 object-contain" />
                    </Link>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Интернет-магазин косметики для ухода за волосами и бородой. Только проверенные средства.
                    </p>
                </div>

                {/* Навигация */}
                <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                    <Link to="/all" className="hover:opacity-80 transition">
                        ВЕСЬ КАТАЛОГ
                    </Link>
                    <Link to="/pomade" className="hover:opacity-80 transition">
                        ПОМАДЫ
                    </Link>
                    <Link to="/lacquer" className="hover:opacity-80 transition">
                        ЛАКИ
                    </Link>
                    <Link to="/oil" className="hover:opacity-80 transition">
                        МАСЛО
                    </Link>
                    <Link to="/cream" className="hover:opacity-80 transition">
                        КРЕМА
                    </Link>
                </nav>

                {/* Иконки соцсетей */}
                <div className="flex gap-4 items-center">
                    <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                        <Icon icon="mdi:telegram" width={24} height={24} className="hover:text-primary transition" />
                    </a>
                    <a href="https://vk.com/" target="_blank" rel="noopener noreferrer">
                        <Icon icon="mdi:vk" width={24} height={24} className="hover:text-primary transition" />
                    </a>
                    <a href="mailto:example@mail.com">
                        <Icon icon="mdi:email-outline" width={24} height={24} className="hover:text-primary transition" />
                    </a>
                </div>
            </div>

            {/* Копирайт */}
            <div className="text-center text-xs text-gray-500 mt-6">© {new Date().getFullYear()} Все права защищены</div>
        </footer>
    );
};
