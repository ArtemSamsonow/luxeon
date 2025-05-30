import { HomePage, ProductsPage, SignIn, AdminPanel } from "@views";
import { Footer, Header } from "@/widgets";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@shared";
import { Spinner } from "@heroui/react";

export function MainLayout() {
    const { admin, loading } = useAdminAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {location.pathname !== "/admin" && <Header />}

            <div className="flex-grow mb-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/lacquer" element={<ProductsPage title="Лаки" category="lacquer" />} />
                    <Route path="/oil" element={<ProductsPage title="Масла" category="oil" />} />
                    <Route path="/pomade" element={<ProductsPage title="Помады" category="pomade" />} />
                    <Route path="/cream" element={<ProductsPage title="Крема" category="cream" />} />
                    <Route path="/all" element={<ProductsPage title="Все товары" category="all" />} />
                    <Route path="/new" element={<ProductsPage title="Новинки" category="new" />} />
                    <Route path="/login" element={admin ? <Navigate to="/admin" replace /> : <SignIn />} />
                    <Route path="/admin" element={admin ? <AdminPanel /> : <Navigate to="/" replace />} />
                </Routes>
            </div>

            {location.pathname !== "/admin" && <Footer />}
        </div>
    );
}
