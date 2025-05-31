import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase.ts";
import {
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
    TableColumn,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    Spinner,
} from "@heroui/react";

interface Order {
    id: string;
    fullName: string;
    phone: string;
    totalPrice: number;
    createdAt: any;
    status: string;
    items: { name: string; quantity: number }[];
}

type ActionType = "delete" | "submit" | null;

export const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<ActionType>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "orders"));
        const data: Order[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Order[];
        setOrders(data);
        setLoading(false);
    };

    const handleAction = async () => {
        if (!selectedOrderId || !actionType) return;

        if (actionType === "delete") {
            await deleteDoc(doc(db, "orders", selectedOrderId));
        } else if (actionType === "submit") {
            await updateDoc(doc(db, "orders", selectedOrderId), {
                status: "Оформлен",
            });
        }

        closeModal();
        fetchOrders();
    };

    const openModal = (orderId: string, type: ActionType) => {
        setSelectedOrderId(orderId);
        setActionType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrderId(null);
        setActionType(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Список заказов</h2>
            <Table className="min-w-full bg-white">
                <TableHeader>
                    <TableColumn>ФИО</TableColumn>
                    <TableColumn>Телефон</TableColumn>
                    <TableColumn>Товары</TableColumn>
                    <TableColumn>Сумма</TableColumn>
                    <TableColumn>Дата</TableColumn>
                    <TableColumn>Статус</TableColumn>
                    <TableColumn>Действие</TableColumn>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.fullName}</TableCell>
                            <TableCell>{order.phone}</TableCell>
                            <TableCell className="max-w-[600px]">
                                <ul className="list-disc list-inside">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.name} — {item.quantity} шт
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>{order.totalPrice} ₽</TableCell>
                            <TableCell>
                                {order.createdAt?.toDate
                                    ? order.createdAt.toDate().toLocaleString()
                                    : new Date(order.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                                {order.status != "Оформлен" && (
                                    <div className="flex flex gap-1">
                                        <Button color="warning" variant="light" onClick={() => openModal(order.id, "submit")}>
                                            Оформить заказ
                                        </Button>
                                        <Button color="danger" variant="light" onClick={() => openModal(order.id, "delete")}>
                                            Удалить
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal isOpen={modalOpen} onOpenChange={closeModal}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>{actionType === "delete" ? "Удаление заказа" : "Оформление заказа"}</ModalHeader>
                            <ModalBody>
                                {actionType === "delete" ? (
                                    <p>Вы уверены, что хотите удалить этот заказ? Это действие необратимо.</p>
                                ) : (
                                    <p>Вы уверены, что хотите оформить этот заказ?</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onClick={closeModal}>
                                    Отмена
                                </Button>
                                <Button color={actionType === "delete" ? "danger" : "primary"} onClick={handleAction}>
                                    {actionType === "delete" ? "Удалить" : "Оформить"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
