import formatRupiah from '@/utils/formatRupiah';
import React from 'react';
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaPencil,
  FaTrash,
} from 'react-icons/fa6';
import { IoCalendarOutline } from 'react-icons/io5';

type TransactionProps = {
  type: 'income' | 'expense';
  date: string;
  category: string;
  amount: number;
  note: string | undefined;
  walletName: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const TransactionItem = ({
  type,
  date,
  category,
  amount,
  note,
  walletName,
  onEdit,
  onDelete,
}: TransactionProps) => {
  return (
    <div
      className="w-full px-4 py-5 rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:transform hover:scale-[1.02] flex items-center gap-4"
      onMouseEnter={() => console.log('Mouse entered')}>
      <div
        className={`${
          type !== 'expense'
            ? 'bg-green-50 text-green-500 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }} rounded-full size-14 hidden sm:flex items-center justify-center`}>
        {type === 'expense' ? (
          <FaArrowTrendDown size={25} />
        ) : (
          <FaArrowTrendUp size={25} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-2">
          <h3 className="font-semibold text-slate-900 truncate">{note}</h3>
          <p className="sm:bg-indigo-100 sm:px-4 py-1 text-xs rounded-full text-indigo-600 font-bold border-indigo-200 truncate">
            {category}
          </p>
        </div>
        <div className="flex items-center text-sm text-slate-500">
          <IoCalendarOutline className="w-3 h-3 mr-1 hidden sm:block" />
          {date}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-shrink-0">
        <div className="text-right">
          <div
            className={`text-base sm:text-xl font-bold ${
              type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
            {type === 'income' ? '+ ' : '- '}
            {formatRupiah(amount || 0)}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            {type}
          </div>
          <div className="text-xs text-indigo-500 uppercase tracking-wide">
            {walletName}
          </div>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          {onEdit && (
            <button
              className={`size-8 p-0 transition-colors duration-200
              hover:bg-blue-50  hover:text-blue-600 flex items-center justify-center rounded-full cursor-pointer`}
              onClick={onEdit}>
              <FaPencil size={12} />
            </button>
          )}
          {onDelete && (
            <button
              className={`size-8 p-0 transition-colors duration-200 hover:bg-red-50  hover:text-red-600 flex items-center justify-center rounded-full cursor-pointer`}
              onClick={onDelete}>
              <FaTrash size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
