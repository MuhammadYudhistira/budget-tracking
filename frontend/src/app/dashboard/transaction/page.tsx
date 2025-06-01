'use client';
import TransactionCard from '@/ui/TransactionCard';
import formatRupioh from '@/utils/formatRupiah';
import Link from 'next/link';
import React from 'react';
import { FaEdit, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';

const page = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <TransactionCard
          title="Total Pengeluaran Hari ini"
          value={formatRupioh(100000)}
        />
        <TransactionCard title="Jumlah Transaksi Hari ini" value={10} />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Transaksi..."
            className="pl-10 pr-4 py-2 border border-gray-400 rounded-md w-full text-sm"
          />
        </div>
        <Link
          href={'/dashboard/transaction/create'}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 w-full sm:w-fit justify-center">
          <FaPlus /> Create Transaction
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[600px]">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="p-3">No</th>
                <th>Nama</th>
                <th>Waktu</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody className="">
              <tr className="border-t text-gray-700">
                <td className="p-4">1</td>
                <td>Adit</td>
                <td>2025-01-02</td>
                <td>{formatRupioh(2000000)}</td>
                <td>
                  <div className="flex items-center gap-4">
                    <Link
                      href={'/dashboard/transaction/edit'}
                      className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </Link>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
