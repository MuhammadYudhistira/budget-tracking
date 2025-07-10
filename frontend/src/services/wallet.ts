import api from "@/api";
import getTokenHeader from "@/utils/getTokenHeader";
import { handleApiError } from "@/utils/handleApiError";

export const fetchWalletsByUser = async () => {
    try {
        const res = await api.get("/wallet", {
            headers: getTokenHeader(),
        });
        return res.data;
    } catch (error) {
        handleApiError(error, "Wallet fetch failed");
    }
};

export const fetchWalletById = async (id: string) => {
    try {
        const res = await api.get(`/wallet/${id}`, {
            headers: getTokenHeader(),
        });
        return res.data;
    } catch (error) {
        handleApiError(error, "Wallet fetch failed");
    }
};

export const createWallet = async (data: Record<string, unknown>) => {
    try {
        const res = await api.post("/wallet", data, {
            headers: getTokenHeader(),
        });
        return res.data;
    } catch (error) {
        handleApiError(error, "Wallet creation failed");
    }
};

export const updateWallet = async (
    id: number,
    data: Record<string, unknown>
) => {
    try {
        const res = await api.put(`/wallet/${id}`, data, {
            headers: getTokenHeader(),
        });
        return res.data;
    } catch (error) {
        handleApiError(error, "Wallet update failed");
    }
};

export const deleteWallet = async (id: number) => {
    try {
        const res = await api.delete(`/wallet/${id}`, {
            headers: getTokenHeader(),
        });
        return res.data;
    } catch (error) {
        handleApiError(error, "Wallet deletion failed");
    }
};
