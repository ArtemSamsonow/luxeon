import { useState } from "react";
import { Badge, Button, useDisclosure } from "@heroui/react";
import { BasketModal, Logo, useBasket } from "@shared";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const Header = () => {
    const { basket, basketItems, removeFromBasket, clearBasket } = useBasket();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full border-b">
            <div className="flex justify-between items-center w-full max-w-[1440px] m-auto p-4">
                <Link to="/" className="flex items-center gap-2">
                    <img src={Logo} alt="Логотип" className="w-24 h-16 object-contain" />
                </Link>

                <button className="md:hidden" onClick={() => setMenuOpen((prev) => !prev)}>
                    <Icon icon="heroicons-outline:menu" width={28} height={28} />
                </button>

                <nav className="hidden md:flex gap-6 items-center">
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
                        МАСЛA
                    </Link>
                    <Link to="/cream" className="hover:opacity-80 transition">
                        КРЕМА
                    </Link>
                </nav>

                <Badge color="warning" className="p-2.5 font-bold" content={basket.length}>
                    <Button
                        color="primary"
                        radius="full"
                        className="w-38 text-sm sm:flex"
                        onPress={onOpen}
                        startContent={<Icon icon="solar:cart-large-minimalistic-linear" width={24} height={24} />}
                    >
                        Корзина
                    </Button>
                </Badge>
            </div>

            {menuOpen && (
                <div className="md:hidden px-4 pb-4 flex flex-col items-center gap-3">
                    <Link to="/all" onClick={() => setMenuOpen(false)}>
                        ВЕСЬ КАТАЛОГ
                    </Link>
                    <Link to="/pomade" onClick={() => setMenuOpen(false)}>
                        ПОМАДЫ
                    </Link>
                    <Link to="/lacquer" onClick={() => setMenuOpen(false)}>
                        ЛАКИ
                    </Link>
                    <Link to="/oil" onClick={() => setMenuOpen(false)}>
                        МАСЛО
                    </Link>
                    <Link to="/cream" onClick={() => setMenuOpen(false)}>
                        КРЕМА
                    </Link>
                </div>
            )}

            <BasketModal
                basketItems={basketItems}
                clearBasket={clearBasket}
                removeFromBasket={removeFromBasket}
                onOpenChange={onOpenChange}
                isOpen={isOpen}
            />
        </header>
    );
};
