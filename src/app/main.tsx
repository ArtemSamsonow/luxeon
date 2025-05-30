import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/app/providers";
import { MainLayout } from "@/app/layout";
import { BrowserRouter } from "react-router-dom";

import "./styles/index.css";
import "./styles/tailwindcss.css";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/scrollbar";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProviders>
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        </AppProviders>
    </StrictMode>,
);
