import React, { useState } from 'react';
import { Modal } from './Modal'; // Giả định Modal component đã có
import { CheckIcon, SparklesIcon, ArrowRightIcon } from './Icons'; // Giả định các icon này đã có

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const premiumMonthlyPrice = 200000;
  const premiumAnnualPrice = premiumMonthlyPrice * 12 * 0.8; // Giảm 20% cho hàng năm
  const premiumAnnualPricePerMonth = premiumAnnualPrice / 12;
  const premiumTotalAnnual = premiumAnnualPrice * 12;

  const currentPrice = isAnnual ? premiumAnnualPricePerMonth : premiumMonthlyPrice;
  const displayPrice = isAnnual ? premiumAnnualPrice.toLocaleString('vi-VN') : premiumMonthlyPrice.toLocaleString('vi-VN');
  const priceUnit = isAnnual ? 'VNĐ/năm' : 'VNĐ/tháng';

  const handleSubscribeClick = () => {
    setShowPaymentInfo(true);
  };

  // Thông tin QR Code
  const bankCode = "VCB"; // Đã là VCB (Vietcombank)
  const accountNumber = "0171003462117";
  const accountName = "PHAN ANH TUAN";
  const amount = isAnnual ? premiumTotalAnnual : premiumMonthlyPrice;
  const addInfo = "KHOA_HOC_VIP";

  const qrCodeUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setShowPaymentInfo(false); }} title="Đầu tư cho Kỷ luật - Đầu tư cho Tương lai">
      <div className="p-4">
        {/* Toggle Thanh toán Tháng / Năm */}
        <div className="flex justify-center mb-8">
          <div className="relative flex p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                !isAnnual ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Thanh toán Tháng
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isAnnual ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Thanh toán Năm <span className="ml-2 text-xs bg-green-500 px-2 py-0.5 rounded-full text-white">-20%</span>
            </button>
          </div>
        </div>

        {showPaymentInfo ? (
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl text-center flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông tin thanh toán</h3>
            <img src={qrCodeUrl} alt="QR Code Thanh Toán" className="w-64 h-64 md:w-80 md:h-80 object-contain mx-auto mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-2" />
            <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">Ngân hàng: <span className="font-bold">Vietcombank</span></p>
            <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">Số tài khoản: <span className="font-bold">{accountNumber}</span></p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Tên chủ thẻ: <span className="font-bold">{accountName}</span></p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Số tiền: <span className="font-bold">{amount.toLocaleString('vi-VN')} VNĐ</span></p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">Nội dung: <span className="font-bold">SDT + VIP</span></p>
            
            <button 
              onClick={() => setShowPaymentInfo(false)}
              className="mt-6 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
            >
              Quay lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gói Nhận thức (Free) */}
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

            {/* Gói Kỷ luật (Premium) */}
            <div className="relative flex flex-col p-8 rounded-3xl border-2 border-primary-600 dark:border-luxury-gold bg-primary-50 dark:bg-gray-900 shadow-xl transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 dark:bg-luxury-gold text-white dark:text-black text-xs font-bold uppercase rounded-full shadow-lg flex items-center">
                <SparklesIcon className="h-4 w-4 mr-1" /> KHUYÊN DÙNG
              </div>
              <h3 className="text-2xl font-bold text-primary-600 dark:text-luxury-gold mb-4">Kỷ luật</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Đạt được tự do tài chính với sự kỷ luật.</p>
              
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                {displayPrice} <span className="text-xl font-semibold">{priceUnit}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {isAnnual && `Tiết kiệm 20% so với thanh toán hàng tháng`}
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
                onClick={handleSubscribeClick}
                className="w-full py-3 bg-primary-600 dark:bg-luxury-gold text-white dark:text-black font-bold rounded-xl hover:bg-primary-700 dark:hover:bg-luxury-gold/90 transition-colors shadow-lg shadow-primary-900/20 dark:shadow-luxury-gold/30 flex items-center justify-center"
              >
                Đăng ký ngay <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};