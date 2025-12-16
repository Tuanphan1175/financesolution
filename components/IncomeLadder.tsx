
import React, { useState } from 'react';
import { BriefcaseIcon, TrendingUpIcon, CollectionIcon } from './Icons';

const levels = [
    { level: 1, title: 'Người học việc', range: '< 10tr/tháng', tasks: ['Học 1 kỹ năng chuyên sâu', 'Đọc 1 sách/tháng', 'Tăng năng suất làm việc'] },
    { level: 2, title: 'Người thạo việc', range: '10-20tr/tháng', tasks: ['Thương lượng tăng lương', 'Nhận thêm dự án ngoài', 'Xây dựng mối quan hệ ngành'] },
    { level: 3, title: 'Chuyên gia / Freelancer', range: '20-50tr/tháng', tasks: ['Xây dựng thương hiệu cá nhân', 'Đóng gói dịch vụ', 'Tối ưu quy trình làm việc'] },
    { level: 4, title: 'Quản lý / Chủ nhỏ', range: '50-100tr/tháng', tasks: ['Tuyển dụng nhân sự hỗ trợ', 'Tự động hóa quy trình', 'Mở rộng kênh bán hàng'] },
    { level: 5, title: 'Chủ doanh nghiệp', range: '100-500tr/tháng', tasks: ['Xây dựng hệ thống vận hành', 'Mở rộng quy mô', 'Chiến lược vốn'] },
    { level: 6, title: 'Nhà đầu tư', range: '> 500tr/tháng', tasks: ['Phân bổ tài sản đa kênh', 'Tối ưu thuế', 'Đầu tư vào doanh nghiệp khác'] },
    { level: 7, title: 'Huyền thoại', range: 'Không giới hạn', tasks: ['Từ thiện', 'Viết sách/Di sản', 'Quỹ đầu tư mạo hiểm'] },
];

export const IncomeLadder: React.FC = () => {
    const [selectedLevel, setSelectedLevel] = useState(1);

    return (
        <div className="space-y-6">
            <div className="bg-purple-600 text-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-2">7 Cấp Độ Kiếm Tiền</h2>
                <p className="opacity-90">Xác định vị thế và leo lên nấc thang tiếp theo.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-2">
                    {levels.map((lvl) => (
                        <button
                            key={lvl.level}
                            onClick={() => setSelectedLevel(lvl.level)}
                            className={`w-full text-left p-4 rounded-lg flex justify-between items-center transition-all ${
                                selectedLevel === lvl.level
                                ? 'bg-white dark:bg-gray-800 border-l-4 border-purple-500 shadow-md transform translate-x-1'
                                : 'bg-transparent hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <span className="font-bold">Cấp {lvl.level}</span>
                            <span className="text-sm">{lvl.title}</span>
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="flex items-center mb-6">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                            <TrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{levels[selectedLevel-1].title}</h3>
                            <p className="text-purple-600 font-medium">{levels[selectedLevel-1].range}</p>
                        </div>
                    </div>

                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2 dark:border-gray-700">Nhiệm vụ để lên cấp tiếp theo:</h4>
                    <div className="space-y-4">
                        {levels[selectedLevel-1].tasks.map((task, idx) => (
                            <div key={idx} className="flex items-start">
                                <input type="checkbox" className="mt-1 h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                                <label className="ml-3 text-gray-700 dark:text-gray-300">{task}</label>
                            </div>
                        ))}
                    </div>

                     <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 italic">"Thu nhập của bạn tỉ lệ thuận với giá trị bạn trao đi."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
