import React from 'react';

export const BudgetSettings: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thiết lập Ngân sách</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Tại đây bạn có thể điều chỉnh các cài đặt liên quan đến ngân sách của mình.
      </p>

      <div className="space-y-4">
        {/* Ví dụ về một tùy chọn cài đặt */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <label htmlFor="budget-alert" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Nhận thông báo khi đạt 80% ngân sách
          </label>
          <input
            type="checkbox"
            id="budget-alert"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>

        {/* Thêm các tùy chọn khác tại đây */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <label htmlFor="budget-rollover" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Tự động chuyển ngân sách còn lại sang tháng sau
          </label>
          <input
            type="checkbox"
            id="budget-rollover"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
};