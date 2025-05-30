import { useForm } from "react-hook-form";
import { useState } from "react";
import { auth } from "../../../../firebase.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RHFProvider } from "@/app/providers";

interface ILoginForm {
    email: string;
    password: string;
}

export const SignIn = () => {
    const methods = useForm<ILoginForm>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: ILoginForm) => {
        const { email, password } = data;
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError("Ошибка авторизации: " + err.message);
        }
    };

    return (
        <div className="flex flex-col justify-center m-auto max-w-[500px]">
            <h2 className="font-bold text-2xl">Авторизация</h2>
            <RHFProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className="space-y-4  mt-10 p-10 border-1">
                <div>
                    <input
                        {...register("email", { required: "Введите email" })}
                        placeholder="Email"
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        {...register("password", { required: "Введите пароль" })}
                        placeholder="Пароль"
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Войти
                </button>
            </RHFProvider>
        </div>
    );
};
