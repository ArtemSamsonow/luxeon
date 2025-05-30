import { FC, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase.ts";
import { Button, Chip } from "@heroui/react";
import { useBasket } from "@shared";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    new?: boolean;
}

interface ProductsPageProps {
    title: string;
    category: "all" | "new" | string;
}

export const ProductsPage: FC<ProductsPageProps> = ({ title, category }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToBasket, isInBasket, removeFromBasket } = useBasket();

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const items: Product[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Product, "id">),
            }));

            const filtered =
                category === "all"
                    ? items
                    : category === "new"
                      ? items.filter((item) => item.new)
                      : items.filter((item) => item.category === category);

            setProducts(filtered);
        };

        fetchProducts();
    }, [category]);

    return (
        <div className="p-4 max-w-[1440px] mx-auto">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => {
                    const inBasket = isInBasket(product.id);

                    return (
                        <div key={product.id} className="border relative flex flex-col p-4 rounded mx-auto max-w-[342px]">
                            {product.new && (
                                <Chip color="success" className="absolute top-1 left-1">
                                    New
                                </Chip>
                            )}
                            <img src={product.image} alt={product.name} className="w-fit mx-auto h-64 bg-contain mb-2" />
                            <h2 className="font-bold mb-2">{product.name}</h2>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                            <Button
                                color={inBasket ? "danger" : "primary"}
                                className="mt-auto"
                                onClick={() => (inBasket ? removeFromBasket(product.id) : addToBasket(product.id))}
                            >
                                {inBasket ? "Удалить из корзины" : `${product.price} ₽`}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
