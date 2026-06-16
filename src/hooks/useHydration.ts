"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export const useHydration = () => {
    useEffect(() => {
        useAuthStore.getState().hydrateFromStorage();
    }, []);
};
