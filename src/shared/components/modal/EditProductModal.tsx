import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Switch,
    ModalContent,
    Select,
    SelectItem,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useEffect } from "react";
import { RHFProvider } from "@/app/providers";

interface Product {
    id: string;
    category: string;
    description: string;
    image: string;
    name: string;
    new: boolean;
    price: number;
}

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    onSave: (product: Product) => void;
}

const categories = [
    { label: "Крем", value: "cream" },
    { label: "Помада", value: "pomade" },
    { label: "Лак", value: "lacquer" },
    { label: "Масло", value: "oil" },
];

export const EditProductModal = ({ isOpen, onClose, product, onSave }: EditProductModalProps) => {
    const methods = useForm<Product>({
        defaultValues: product,
    });

    const { handleSubmit, reset, control } = methods;

    useEffect(() => {
        reset(product);
    }, [product, reset]);

    const onSubmit = async (data: Product) => {
        const docRef = doc(db, "products", data.id);
        try {
            await updateDoc(docRef, {
                name: data.name,
                category: data.category,
                price: data.price,
                image: data.image,
                description: data.description,
                new: data.new,
            });
            onSave(data);
            onClose();
        } catch (err) {
            console.error("Ошибка при обновлении товара:", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="2xl">
            <ModalContent>
                {() => (
                    <RHFProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <ModalHeader>Редактировать товар</ModalHeader>
                        <ModalBody className="space-y-4">
                            <Controller name="name" control={control} render={({ field }) => <Input label="Название" {...field} />} />
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
                                        value={field.value?.toString() || ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                            <Controller name="image" control={control} render={({ field }) => <Input label="Изображение" {...field} />} />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => <Textarea label="Описание" {...field} />}
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
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" variant="light" onClick={onClose}>
                                Отмена
                            </Button>
                            <Button color="primary" type="submit">
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </RHFProvider>
                )}
            </ModalContent>
        </Modal>
    );
};
