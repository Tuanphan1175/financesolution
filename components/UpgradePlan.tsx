import React, { useState } from 'react';
import { CheckIcon, SparklesIcon, ArrowRightIcon } from './Icons'; // Giả định các icon này đã có
import { XIcon } from './Icons'; // Thêm dòng này

export const UpgradePlan: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false); // State để hiển thị thông tin thanh toán/QR

  const premiumMonthlyPrice = 200000;
  const premiumAnnualPrice = 180000; // Giả định giảm giá còn 180k/tháng khi trả hàng năm
  const premiumTotalAnnual = premiumAnnualPrice * 12;

  const handleUpgradeClick = () => {
    setShowPaymentInfo(true); // Khi bấm nút, hiển thị thông tin thanh toán
  };

  // Thông tin QR Code
  const bankCode = "VCB";
  const accountNumber = "0171003462117";
  const accountName = "PHAN ANH TUAN";
  const amount = isAnnual ? premiumTotalAnnual : premiumMonthlyPrice;
  const addInfo = "KHOA_HOC_VIP";

  const qrCodeUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 leading-tight">
        Gói Cố vấn - <span className="text-primary-600 dark:text-luxury-gold">Cam kết kỷ luật</span> bắt đầu từ đây.
      </h2>

      {/* Toggle Hàng tháng / Hàng năm */}
      <div className="flex justify-center mb-10">
        <div className="relative flex p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          <button
            onClick={() => { setIsAnnual(false); setShowPaymentInfo(false); }} // Reset payment info khi đổi gói
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              !isAnnual ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Hàng tháng
          </button>
          <button
            onClick={() => { setIsAnnual(true); setShowPaymentInfo(false); }} // Reset payment info khi đổi gói
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isAnnual ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Hàng năm
          </button>
        </div>
      </div>

      {showPaymentInfo ? (
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông tin thanh toán</h3>
          <img src={qrCodeUrl} alt="QR Code Thanh Toán" className="w-64 h-64 md:w-80 md:h-80 object-contain mx-auto mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">Ngân hàng: <span className="font-bold">MB Bank</span></p>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">Số tài khoản: <span className="font-bold">{accountNumber}</span></p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Tên chủ thẻ: <span className="font-bold">{accountName}</span></p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Số tiền: <span className="font-bold">{amount.toLocaleString('vi-VN')} VNĐ</span></p>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">Nội dung: <span className="font-bold">SDT + VIP</span></p>
          
          <button 
            onClick={() => setShowPaymentInfo(false)} // Đóng thông tin thanh toán
            className="mt-6 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
          >
            Quay lại
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thẻ Free - Nhận thức */}
          <div className="flex flex-col p-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nhận thức</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Hiểu rõ tình hình tài chính của bạn.</p>
            
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              0 <span className="text-xl font-semibold">VNĐ</span>
            </div>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300 flex-grow mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Ghi chép cơ bản
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Báo cáo tuần
              </li>
              <li className="flex items-center opacity-50">
                <SparklesIcon className="h-5 w-5 text-gray-400 mr-2" /> Mở khóa AI Coach không giới hạn
              </li>
              <li className="flex items-center opacity-50">
                <ArrowRightIcon className="h-5 w-5 text-gray-400 mr-2" /> Biểu đồ dự báo dòng tiền
              </li>
              <li className="flex items-center opacity-50">
                <CheckIcon className="h-5 w-5 text-gray-400 mr-2" /> Tham gia cộng đồng kín
              </li>
            </ul>

            <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-not-allowed">
              Đang sử dụng
            </button>
          </div>

          {/* Thẻ Premium - Kỷ luật */}
          <div className="relative flex flex-col p-8 rounded-3xl border-2 border-primary-600 dark:border-luxury-gold bg-primary-50 dark:bg-gray-900 shadow-xl transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 dark:bg-luxury-gold text-white dark:text-black text-xs font-bold uppercase rounded-full shadow-lg flex items-center">
              <SparklesIcon className="h-4 w-4 mr-1" /> KHUYÊN DÙNG
            </div>
            <h3 className="text-2xl font-bold text-primary-600 dark:text-luxury-gold mb-4">Kỷ luật</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Đạt được tự do tài chính với sự kỷ luật.</p>
            
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              {isAnnual ? premiumAnnualPrice.toLocaleString('vi-VN') : premiumMonthlyPrice.toLocaleString('vi-VN')} <span className="text-xl font-semibold">VNĐ</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {isAnnual ? `/tháng (Tổng ${premiumTotalAnnual.toLocaleString('vi-VN')} VNĐ/năm)` : '/tháng'}
            </p>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300 flex-grow mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Ghi chép nâng cao
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Báo cáo chi tiết
              </li>
              <li className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-green-500 mr-2" /> Mở khóa AI Coach không giới hạn
              </li>
              <li className="flex items-center">
                <ArrowRightIcon className="h-5 w-5 text-green-500 mr-2" /> Biểu đồ dự báo dòng tiền
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Tham gia cộng đồng kín
              </li>
            </ul>

            <button 
              onClick={handleUpgradeClick}
              className="w-full py-3 bg-primary-600 dark:bg-luxury-gold text-white dark:text-black font-bold rounded-xl hover:bg-primary-700 dark:hover:bg-luxury-gold/90 transition-colors shadow-lg shadow-primary-900/20 dark:shadow-luxury-gold/30 flex items-center justify-center"
            >
              Tham gia kỷ luật 90 ngày <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};