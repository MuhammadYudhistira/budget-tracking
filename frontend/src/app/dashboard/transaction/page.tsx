"use client";
import React, { useState, useEffect } from "react";
import TransactionCard from "@/ui/TransactionCard";
import { FaSearch, FaPlus } from "react-icons/fa";
import Link from "next/link";
import {
    deleteTransaction,
    fetchTotalExpenseStat,
    fetchTransaction,
} from "@/services/transaction";
import { Transaction } from "@/interfaces/IDashboard";
import { ModalProps } from "@/interfaces/IModal";
import Modal from "@/ui/Modal";
import formatRupiah from "@/utils/formatRupiah";
import TransactionItem from "@/ui/TransactionItem";
import { useRouter } from "next/navigation";
import Pagination from "@/ui/Pagination";

export default function TransactionPage() {
    const [search, setSearch] = useState("");
    const [transaction, setTransaction] = useState<Transaction[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ totalExpense: 0, count: 0 });
    const [modal, setModal] = useState<ModalProps | null>(null);
    const router = useRouter();

        const loadTransaction = async () => {
            try {
                const res = await fetchTransaction(page, limit, search);
                setTransaction(res.data);
                setTotalPages(res.pagination.totalPages);
            } catch (error) {
                if (error instanceof Error) {
                    console.error({ message: error.message, type: "danger" });
                } else {
                    console.error({ message: "Terjadi Kesalahan", type: "danger" });
                }
            }
        };

            const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const loadStats = async () => {
        try {
            const res = await fetchTotalExpenseStat();
            setStats(res.data);
        } catch (error) {
            if (error instanceof Error) {
                console.error({ message: error.message, type: "danger" });
            } else {
                console.error({ message: "Terjadi Kesalahan", type: "danger" });
            }
        }
    };

    useEffect(() => {
        loadTransaction();
        loadStats();
    }, [page, search, limit]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDelete = async (id: number) => {
        setModal({
            type: "danger",
            message: "Apakah Kamu yakin ingin menghapus transaksi ini?",
            onOk: async () => {
                try {
                    await deleteTransaction(id);
                    setModal({
                        type: "success",
                        message: "Transaksi Berhasil Dihapus",
                        onOk: () => setModal(null),
                    });

                    const res = await fetchTransaction(page, limit, search);
                    setTransaction(res.data);
                    setTotalPages(res.pagination.totalPages);
                    loadStats();
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
    return (
        <div className="lg:w-[80%] mx-auto p-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TransactionCard
                    title="Total Pengeluaran Hari Ini"
                    value={formatRupiah(stats?.totalExpense)}
                />
                <TransactionCard
                    title="Jumlah Transaksi Hari Ini"
                    value={stats.count}
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari Transaksi..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
                    />
                </div>

                <Link
                    href="/dashboard/transaction/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex 
          items-center justify-center gap-2 hover:bg-indigo-700 w-full sm:w-fit"
                >
                    <FaPlus /> Buat Transaksi
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center justify-center space-y-4">
                {transaction.length > 0 ? (
                    transaction.map((tx) => {
                        const tanggal = new Date(tx.date).toLocaleDateString(
                            "id-ID", { day: "numeric", month: "long", year: "numeric"},
                        );

                        return (
                            <TransactionItem
                                key={tx.id}
                                amount={parseInt(tx.amount)}
                                category={tx.category.name}
                                date={tanggal}
                                note={tx.note}
                                type={tx.type}
                                walletName={tx.wallet.name}
                                onDelete={() => handleDelete(tx.id)}
                                onEdit={() =>
                                    router.push(
                                        "/dashboard/transaction/edit/" + tx.id
                                    )
                                }
                            />
                        );
                    })
                ) : (
                    <p className='className="text-center text-gray-400 py-6'>
                        Tidak ada transaksi ditemukan
                    </p>
                )}
            </div>
                   <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

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
