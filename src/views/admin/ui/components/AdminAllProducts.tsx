import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, Spinner, Button } from "@heroui/react";
import { DeleteProductModal, EditProductModal } from "@shared";

interface Product {
    id: string;
    category: string;
    description: string;
    image: string;
    name: string;
    new: boolean;
    price: number;
}

export const AdminAllProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleDelete = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const data: Product[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];

            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleCloseModal = () => setSelectedProduct(null);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Все товары</h2>
            <Table className="min-w-full bg-white">
                <TableHeader>
                    <TableColumn>Изображение</TableColumn>
                    <TableColumn>Название</TableColumn>
                    <TableColumn>Категория</TableColumn>
                    <TableColumn>Цена</TableColumn>
                    <TableColumn>Новинка</TableColumn>
                    <TableColumn>Описание</TableColumn>
                    <TableColumn>Действия</TableColumn>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <img src={product.image} alt={product.name} className="h-16 w-16 object-contain" />
                            </TableCell>
                            <TableCell className="max-w-[300px]">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.price} ₽</TableCell>
                            <TableCell>{product.new ? "Да" : "Нет"}</TableCell>
                            <TableCell className="max-w-[400px]">{product.description}</TableCell>
                            <TableCell>
                                <Button variant="light" color="warning" onClick={() => setSelectedProduct(product)}>
                                    Редактировать
                                </Button>
                                <Button variant="light" color="danger" className="ml-2" onClick={() => setProductToDelete(product)}>
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={handleCloseModal}
                    onSave={(updatedProduct) => {
                        setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
                        handleCloseModal();
                    }}
                />
            )}

            {productToDelete && (
                <DeleteProductModal
                    isOpen={!!productToDelete}
                    product={productToDelete}
                    onClose={() => setProductToDelete(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};
