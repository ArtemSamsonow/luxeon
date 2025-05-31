import { FC, useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { RHFProvider } from "@/app/providers";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase.ts";
import { Icon } from "@iconify/react";

interface BasketItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface FormValues {
    items: BasketItem[];
    fullName: string;
    phone: string;
    totalPrice: number;
}

interface BasketModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    basketItems: Omit<BasketItem, "quantity">[];
    clearBasket: () => void;
    removeFromBasket: (id: string) => void;
}

export const BasketModal: FC<BasketModalProps> = ({ isOpen, clearBasket, onOpenChange, basketItems, removeFromBasket }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const methods = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            items: basketItems.map((item) => ({ ...item, quantity: 1 })),
            fullName: "",
            phone: "",
            totalPrice: 0,
        },
    });

    const {
        control,
        watch,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = methods;

    const { fields, remove, update } = useFieldArray({
        control,
        name: "items",
    });

    useEffect(() => {
        const newItems = basketItems.map((item) => ({ ...item, quantity: 1 }));
        methods.reset({
            ...methods.getValues(),
            items: newItems,
        });
    }, [basketItems]);

    const watchItems = watch("items");
    const totalPrice = watchItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        setValue("totalPrice", totalPrice);
    }, [totalPrice]);

    const handleQuantityChange = (index: number, change: number) => {
        const item = watchItems[index];
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            remove(index);
            removeFromBasket(item.id);
        } else {
            update(index, { ...item, quantity: newQuantity });
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const simplifiedItems = data.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
        }));

        const payload = {
            fullName: data.fullName,
            phone: data.phone,
            items: simplifiedItems,
            totalPrice: data.totalPrice,
            status: "Создан",
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, "orders"), payload);
            setIsSubmitted(true);
            clearBasket();
        } catch (error) {
            console.error("Ошибка при добавлении заказа: ", error);
            alert("Ошибка при оформлении заказа. Попробуйте позже.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) setIsSubmitted(false);
            }}
            size="3xl"
        >
            <ModalContent>
                {() => (
                    <RHFProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <ModalHeader>Корзина</ModalHeader>
                        <ModalBody className="space-y-4">
                            {isSubmitted ? (
                                <div className="flex justify-center items-center flex-col py-8 gap-3">
                                    <Icon icon="solar:bag-check-linear" className="w-[84px] h-[84px] text-green-600" />
                                    <span className="text-lg font-semibold text-green-600">Заказ успешно оформлен!</span>
                                </div>
                            ) : fields.length === 0 ? (
                                <p>Корзина пуста</p>
                            ) : (
                                <>
                                    <ul className="space-y-4 max-h-[400px] overflow-scroll">
                                        {fields.map((item, index) => (
                                            <li key={item.id} className="flex items-center gap-4 border-b pb-2">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">{item.price} ₽ / шт.</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Button
                                                            type="button"
                                                            color="primary"
                                                            size="sm"
                                                            onPress={() => handleQuantityChange(index, -1)}
                                                        >
                                                            -
                                                        </Button>
                                                        <input
                                                            readOnly
                                                            value={watchItems[index]?.quantity}
                                                            className="w-10 text-center border rounded"
                                                        />
                                                        <Button
                                                            type="button"
                                                            color="primary"
                                                            size="sm"
                                                            onPress={() => handleQuantityChange(index, 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>
                                                <span className="font-bold">{item.price * watchItems[index]?.quantity} ₽</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex gap-2">
                                        <div className="w-1/2">
                                            <Input
                                                label="ФИО"
                                                {...register("fullName", { required: "ФИО обязательно" })}
                                                isInvalid={!!errors.fullName}
                                                errorMessage={errors.fullName?.message?.toString()}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Input
                                                label="Телефон"
                                                {...register("phone", {
                                                    required: "Телефон обязателен",
                                                    pattern: {
                                                        value: /^\+7\d{10}$/,
                                                        message: "Формат: +7XXXXXXXXXX",
                                                    },
                                                })}
                                                isInvalid={!!errors.phone}
                                                errorMessage={errors.phone?.message?.toString()}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </ModalBody>

                        {!isSubmitted && fields.length > 0 && (
                            <ModalFooter>
                                <div className="flex items-center gap-3 w-full justify-between">
                                    <div className="text-right font-bold text-lg">Итого: {totalPrice} ₽</div>
                                    <Button color="primary" isDisabled={!isValid} type="submit">
                                        Оформить заказ
                                    </Button>
                                </div>
                            </ModalFooter>
                        )}
                    </RHFProvider>
                )}
            </ModalContent>
        </Modal>
    );
};
