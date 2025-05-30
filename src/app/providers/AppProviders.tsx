import type { PropsWithChildren } from "react";
import { HeroUIProvider } from "@heroui/react";

/**
 * Главный провайдер
 * @param children
 * @constructor
 */
export function AppProviders({ children }: PropsWithChildren) {
    return <HeroUIProvider>{children}</HeroUIProvider>;
}
