import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase.ts";

export const useAdminAuth = () => {
    const [admin, setAdmin] = useState<null | any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setAdmin(user);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { admin, loading };
};
