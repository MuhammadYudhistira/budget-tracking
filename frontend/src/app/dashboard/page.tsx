import { StatCard } from '@/ui/StatCard';
import formatRupioh from '@/utils/formatRupiah';
import React from 'react';
import { FaArrowDown, FaArrowUp, FaPiggyBank, FaWallet } from 'react-icons/fa';

const page = () => {
  const dateNow = new Date().toLocaleDateString('en-EN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="p-3 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-8 text-white bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-3xl font-semibold">Wellcome Back, User</h2>
            <p className="mt-1 font-normal">
              Insights at a glance: Empowering your financial journey.
            </p>
          </div>
          <div className="text-right text-medium text-white">
            <p className="font-medium">{dateNow}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value={formatRupioh(2000000) || 0}
            change="This Month"
            color="text-gray-600"
            icon=<FaWallet size={24} />
          />
          <StatCard
            title="Total Savings"
            value={formatRupioh(2000000) || 0}
            change="For Recommendations"
            color="text-gray-600"
            icon=<FaPiggyBank size={24} />
          />
          <StatCard
            title="Total Incomes"
            value={formatRupioh(200000) || 0}
            change="This Month"
            color="text-gray-600"
            icon=<FaArrowDown size={24} />
          />
          <StatCard
            title="Total Expenses"
            value={formatRupioh(20000) || 0}
            change="This Month"
            color="text-gray-600"
            icon=<FaArrowUp size={24} />
          />
        </div>
      </div>
    </div>
  );
};

export default page;
