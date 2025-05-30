import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.ts";

export function useBasket() {
    const [basket, setBasket] = useState<string[]>([]);
    const [basketItems, setBasketItems] = useState<any[]>([]);

    const updateBasketFromStorage = () => {
        const storedBasket = JSON.parse(localStorage.getItem("basket") || "[]");
        setBasket(storedBasket);
    };

    useEffect(() => {
        updateBasketFromStorage();

        window.addEventListener("basket-updated", updateBasketFromStorage);
        return () => {
            window.removeEventListener("basket-updated", updateBasketFromStorage);
        };
    }, []);

    useEffect(() => {
        const fetchBasketItems = async () => {
            const itemPromises = basket.map(async (id) => {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    return { id: docSnap.id, ...docSnap.data() };
                }
                return null;
            });

            const items = await Promise.all(itemPromises);
            setBasketItems(items.filter((item) => item !== null));
        };

        if (basket.length > 0) {
            fetchBasketItems();
        } else {
            setBasketItems([]);
        }
    }, [basket]);

    const addToBasket = (productId: string) => {
        if (!basket.includes(productId)) {
            const updatedBasket = [...basket, productId];
            localStorage.setItem("basket", JSON.stringify(updatedBasket));
            setBasket(updatedBasket);
            window.dispatchEvent(new Event("basket-updated"));
        }
    };

    const clearBasket = () => {
        localStorage.removeItem("basket");
        setBasket([]);
        setBasketItems([]);
        window.dispatchEvent(new Event("basket-updated"));
    };

    const removeFromBasket = (productId: string) => {
        const updatedBasket = basket.filter((id) => id !== productId);
        localStorage.setItem("basket", JSON.stringify(updatedBasket));
        setBasket(updatedBasket);
        window.dispatchEvent(new Event("basket-updated"));
    };

    const isInBasket = (productId: string) => {
        return basket.includes(productId);
    };

    return {
        basket,
        basketItems,
        addToBasket,
        clearBasket,
        removeFromBasket,
        isInBasket,
    };
}
