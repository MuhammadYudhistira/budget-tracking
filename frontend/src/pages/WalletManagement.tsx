"use client";

import { ModalProps } from "@/interfaces/IModal";
import {
    createWallet,
    deleteWallet,
    fetchWalletsByUser,
    updateWallet,
} from "@/services/wallet";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import Modal from "@/ui/Modal";
import formatRupiah from "@/utils/formatRupiah";
import { useEffect, useState } from "react";
import {
    AiOutlineArrowLeft,
    AiOutlineDelete,
    AiOutlineDollar,
    AiOutlineEdit,
    AiOutlinePlus,
    AiOutlineWallet,
} from "react-icons/ai";

interface WalletType {
    id: string;
    name: string;
    balance: number;
    createdAt: Date;
}

type ViewType = "list" | "create" | "edit";

export default function WalletManagement() {
    const [isSubmitting, setISubmitting] = useState(false);

    const [wallets, setWallets] = useState<WalletType[]>([]);
    const [modal, setModal] = useState<ModalProps | null>(null);

    const loadWallet = async () => {
        try {
            const res = await fetchWalletsByUser();
            setWallets(res.data);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "No wallets found for this user") {
                    setWallets([]);
                } else {
                    console.log({
                        message: error.message,
                        type: "danger",
                    });
                }
            } else {
                console.error({ message: "Terjadi Kesalahan", type: "danger" });
            }
        }
    };

    const totalBalance = wallets.reduce((sum, w) => {
        const cleanBalance =
            typeof w.balance === "string" ? parseInt(w.balance) : w.balance;

        return sum + cleanBalance;
    }, 0);

    useEffect(() => {
        loadWallet();
    }, []);

    const [currentView, setCurrentView] = useState<ViewType>("list");
    const [, setSelectedWallet] = useState<WalletType | null>(null);
    const [formData, setFormData] = useState({ id: 0, name: "", balance: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateWallet = async () => {
        setISubmitting(true);
        try {
            await createWallet({ ...formData });
            setModal({
                type: "success",
                message: "Wallet Berhasil Ditambahkan",
                onOk: () => {
                    setModal(null);
                    loadWallet();
                    resetForm();
                    setCurrentView("list");
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                setModal({
                    message: error.message,
                    type: "danger",
                    onOk: () => setModal(null),
                });
            } else {
                setModal({
                    message: "Terjadi Kesalahan",
                    type: "danger",
                    onOk: () => setModal(null),
                });
            }
        } finally {
            setISubmitting(false);
        }
    };

    const handleEditWallet = async () => {
        setISubmitting(true);
        try {
            await updateWallet(formData.id, { ...formData });
            setModal({
                type: "success",
                message: "Wallet Berhasil Diupdate",
                onOk: () => {
                    setModal(null);
                    loadWallet();
                    resetForm();
                    setCurrentView("list");
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                setModal({
                    message: error.message,
                    type: "danger",
                    onOk: () => setModal(null),
                });
            } else {
                setModal({
                    message: "Terjadi Kesalahan",
                    type: "danger",
                    onOk: () => setModal(null),
                });
            }
        } finally {
            setISubmitting(false);
        }
    };

    const handleDeleteWallet = (walletId: number) => {
        setModal({
            type: "danger",
            message: "Apakah Kamu yakin ingin menghapus Wallet ini?",
            onOk: async () => {
                try {
                    await deleteWallet(walletId);
                    setModal({
                        type: "success",
                        message: "Wallet Berhasil Dihapus",
                        onOk: () => {
                            setModal(null);
                            loadWallet();
                        },
                    });
                } catch (error) {
                    console.error(error);
                    setModal({
                        type: "danger",
                        message: "Gagal menghapus transaksi",
                        onOk: () => setModal(null),
                    });
                }
            },
            onCancel: () => setModal(null),
        });
    };

    const openEditForm = (wallet: WalletType) => {
        setSelectedWallet(wallet);
        setFormData({
            id: parseFloat(wallet.id),
            name: wallet.name,
            balance: wallet.balance.toString(),
        });
        setCurrentView("edit");
    };

    const resetForm = () => {
        setFormData({ id: 0, name: "", balance: "" });
        setSelectedWallet(null);
        setCurrentView("list");
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            {isSubmitting && <LoadingSpinnerScreen />}

            <div className="max-w-7xl mx-auto">
                {currentView === "list" &&
                    (wallets.length === 0 ? (
                        <div className="text-center py-16 place-items-center">
                            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AiOutlineWallet className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No wallets yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Create your first wallet to get started
                            </p>
                            <button
                                onClick={() => setCurrentView("create")}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl px-8 py-3 flex items-center justify-center gap-2"
                            >
                                <AiOutlinePlus className="w-5 h-5" />
                                Create Wallet
                            </button>
                        </div>
                    ) : (
                        <WalletList
                            wallets={wallets}
                            onCreate={() => setCurrentView("create")}
                            onEdit={openEditForm}
                            onDelete={handleDeleteWallet}
                            totalBalance={totalBalance}
                            formatCurrency={formatCurrency}
                        />
                    ))}

                {(currentView === "create" || currentView === "edit") && (
                    <WalletForm
                        isEdit={currentView === "edit"}
                        formData={formData}
                        handleChange={handleChange}
                        onCancel={resetForm}
                        onSubmit={
                            currentView === "edit"
                                ? handleEditWallet
                                : handleCreateWallet
                        }
                    />
                )}
            </div>
            {modal && (
                <Modal
                    type={modal.type}
                    message={modal.message}
                    onOk={modal.onOk}
                    onCancel={modal.onCancel}
                />
            )}
        </div>
    );
}

interface WalletListProps {
    wallets: WalletType[];
    totalBalance?: number;
    onCreate: () => void;
    onEdit: (wallet: WalletType) => void;
    onDelete: (id: number) => void;
    formatCurrency: (amount: number) => string;
}

function WalletList({
    wallets,
    onCreate,
    onEdit,
    onDelete,
    totalBalance = 0,
}: WalletListProps) {
    return (
        <div className="space-y-6 animate-in fade-in-0 duration-500">
            <div className="flex items-center justify-between">
                <div className="hidden sm:block">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Wallets
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your digital wallets
                    </p>
                </div>
                <button
                    onClick={onCreate}
                    className="w-full sm:w-auto flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    <AiOutlinePlus className="w-5 h-5 mr-2" />
                    Add Wallet
                </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-indigo-100 text-sm font-medium">
                            Total Balance
                        </p>
                        <p className="text-4xl font-bold mt-2">
                            {formatRupiah(totalBalance)}
                        </p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl hidden sm:block">
                        <AiOutlineWallet className="w-8 h-8" />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-900">
                                {wallet.name}
                            </span>
                            <div className="bg-indigo-100 p-2 rounded-xl">
                                <AiOutlineDollar className="w-4 h-4 text-indigo-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatRupiah(wallet.balance)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Created{" "}
                                {new Date(wallet.createdAt).toLocaleDateString(
                                    "id-ID"
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => onEdit(wallet)}
                                className="flex-1 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 py-2 text-sm"
                            >
                                <AiOutlineEdit className="w-4 h-4 mr-1 inline-block" />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(parseInt(wallet.id))}
                                className="flex-1 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-2 text-sm"
                            >
                                <AiOutlineDelete className="w-4 h-4 mr-1 inline-block" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface WalletFormProps {
    isEdit?: boolean;
    formData: { name: string; balance: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

function WalletForm({
    isEdit,
    formData,
    handleChange,
    onCancel,
    onSubmit,
}: WalletFormProps) {
    return (
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-right-5 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onCancel}
                    className="rounded-xl p-2 hover:bg-gray-100"
                >
                    <AiOutlineArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit Wallet" : "Create New Wallet"}
                    </h1>
                    <p className="text-gray-600">
                        {isEdit
                            ? "Update your wallet details"
                            : "Add a new wallet to your collection"}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl shadow-xl bg-white p-8 space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                    >
                        Wallet Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 h-12 px-4"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="balance"
                        className="text-sm font-medium text-gray-700"
                    >
                        {isEdit ? "Current Balance" : "Initial Balance"}
                    </label>
                    <div className="relative">
                        <AiOutlineDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="balance"
                            name="balance"
                            type="number"
                            step="0.01"
                            value={formData.balance}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 h-12 pl-10"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-gray-200 hover:bg-gray-50 h-12"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={!formData.name || !formData.balance}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                        {isEdit ? "Update Wallet" : "Create Wallet"}
                    </button>
                </div>
            </div>
        </div>
    );
}
