import { useForm, Controller } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../../firebase.ts";
import { Input, Textarea, Switch, Button, Select, SelectItem } from "@heroui/react";
import { RHFProvider } from "@/app/providers";
import { useState } from "react";

interface NewProduct {
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    new: boolean;
}

const categories = [
    { label: "Крем", value: "cream" },
    { label: "Помада", value: "pomade" },
    { label: "Лак", value: "lacquer" },
    { label: "Масло", value: "oil" },
];

export const AdminAddProduct = () => {
    const [loading, setLoading] = useState(false);
    const methods = useForm<NewProduct>({
        defaultValues: {
            name: "",
            category: "",
            price: 0,
            image: "",
            description: "",
            new: false,
        },
    });

    const { handleSubmit, control, reset } = methods;

    const onSubmit = async (data: NewProduct) => {
        setLoading(true);
        try {
            await addDoc(collection(db, "products"), data);
            reset();
            alert("Товар успешно добавлен!");
        } catch (error) {
            console.error("Ошибка при добавлении товара:", error);
            alert("Произошла ошибка при добавлении товара.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Добавить новый товар</h2>
            <RHFProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller name="name" control={control} render={({ field }) => <Input label="Название" isRequired {...field} />} />
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Категория"
                            isRequired
                            selectedKeys={[field.value]}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0];
                                field.onChange(selected);
                            }}
                        >
                            {categories.map((cat) => (
                                <SelectItem key={cat.value}>{cat.label}</SelectItem>
                            ))}
                        </Select>
                    )}
                />
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Цена"
                            type="number"
                            {...field}
                            isRequired
                            value={field.value?.toString() || ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                <Controller
                    name="image"
                    control={control}
                    render={({ field }) => <Input label="URL изображения" isRequired {...field} />}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <Textarea label="Описание" isRequired {...field} />}
                />
                <Controller
                    name="new"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Switch isSelected={field.value} onChange={field.onChange}>
                                Новинка
                            </Switch>
                        </div>
                    )}
                />
                <Button type="submit" color="primary" isLoading={loading}>
                    Добавить товар
                </Button>
            </RHFProvider>
        </div>
    );
};
