import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
} from "@heroui/react";
import { Spinner } from "@heroui/react";

interface Order {
    id: string;
    fullName: string;
    phone: string;
    totalPrice: number;
    createdAt: any;
    items: { name: string; quantity: number }[];
}

export const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

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

    const handleDelete = async () => {
        if (!selectedOrderId) return;
        await deleteDoc(doc(db, "orders", selectedOrderId));
        setDeleteModalOpen(false);
        setSelectedOrderId(null);
        fetchOrders();
    };

    const openDeleteModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedOrderId(null);
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
                    <TableColumn>Действие</TableColumn>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.fullName}</TableCell>
                            <TableCell>{order.phone}</TableCell>
                            <TableCell>
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
                            <TableCell>
                                <Button color="danger" variant="light" onClick={() => openDeleteModal(order.id)}>
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal isOpen={deleteModalOpen} onOpenChange={closeDeleteModal}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>Удаление заказа</ModalHeader>
                            <ModalBody>
                                <p>Вы уверены, что хотите удалить этот заказ? Это действие необратимо.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onClick={closeDeleteModal}>
                                    Отмена
                                </Button>
                                <Button color="danger" onClick={handleDelete}>
                                    Удалить
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
