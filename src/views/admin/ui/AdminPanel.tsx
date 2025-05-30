import { useState } from "react";
import { Button } from "@heroui/react";
import { AdminAddProduct, AdminAllProducts, AdminOrders } from "@/views";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase.ts";
import { redirect } from "react-router-dom";

export const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState<"orders" | "products" | "add">("orders");

    const handleLogout = () => {
        signOut(auth).then(() => {
            redirect("./");
        });
    };

    const getTabClass = (tab: string) =>
        `p-3 cursor-pointer transition-colors ${activeTab === tab ? "text-white" : "text-zinc-500 hover:text-white"}`;

    return (
        <div>
            <div className="flex justify-between items-center bg-zinc-800 py-4 px-20">
                <div className="flex gap-4">
                    <span className={getTabClass("orders")} onClick={() => setActiveTab("orders")}>
                        Заказы
                    </span>
                    <span className={getTabClass("products")} onClick={() => setActiveTab("products")}>
                        Все товары
                    </span>
                    <span className={getTabClass("add")} onClick={() => setActiveTab("add")}>
                        Добавить товар
                    </span>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            handleLogout();
                        }}
                        color="danger"
                    >
                        Выход
                    </Button>
                </div>
            </div>

            <div className="p-10">
                {activeTab === "orders" && <AdminOrders />}
                {activeTab === "products" && <AdminAllProducts />}
                {activeTab === "add" && <AdminAddProduct />}
            </div>
        </div>
    );
};
