import { FormProvider } from "react-hook-form";
import type { BaseSyntheticEvent, PropsWithChildren } from "react";

interface IRHFProvider extends PropsWithChildren {
    withDevTools?: boolean;
    methods: any;
    className?: string;
    onSubmit: (e?: BaseSyntheticEvent<object> | undefined) => void;
}

/**
 * Провайдер react hook form
 */
export function RHFProvider({ children, methods, onSubmit, className }: IRHFProvider) {
    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit} className={className}>
                {children}
            </form>
        </FormProvider>
    );
}
