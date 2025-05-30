import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ModalContent } from "@heroui/react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";

interface Product {
    id: string;
    category: string;
    description: string;
    image: string;
    name: string;
    new: boolean;
    price: number;
}

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onDelete: (id: string) => void;
}

export const DeleteProductModal = ({ isOpen, onClose, product, onDelete }: DeleteProductModalProps) => {
    const handleDelete = async () => {
        if (!product) return;
        try {
            await deleteDoc(doc(db, "products", product.id));
            onDelete(product.id);
            onClose();
        } catch (err) {
            console.error("Ошибка при удалении товара:", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader>Удалить товар</ModalHeader>
                        <ModalBody>
                            <p>
                                Вы уверены, что хотите удалить товар <span className="font-semibold">"{product?.name}"</span>?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
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
    );
};
