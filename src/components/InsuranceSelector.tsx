import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Stethoscope, Clock, Baby, Smile, 
  UserPlus, Hospital, Calendar, PiggyBank, 
  Car, Home, Brain, Activity 
} from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subTypes?: string[];
}

const CATEGORIES: CategoryItem[] = [
  { id: 'cancer', label: '암', icon: Shield, subTypes: ['비갱신형 암보험', '갱신형 암보험', '표적항암 치료특화'] },
  { id: 'surgery', label: '수술/입원비', icon: Activity, subTypes: ['간병인 지원', 'N대 수술비', '종합 수술비'] },
  { id: 'whole', label: '종신', icon: Clock, subTypes: ['납입 면제형', '확정 이율형'] },
  { id: 'newborn', label: '신생아', icon: Baby, subTypes: ['태아 보장', '선천 이상'] },
  { id: 'child', label: '어린이', icon: Smile, subTypes: ['성인 전 환급형', '중증 질환'] },
  { id: 'pre-existing', label: '유병자', icon: Stethoscope, subTypes: ['간편 고지형', '무심사형'] },
  { id: 'medical', label: '의료실비', icon: Stethoscope, subTypes: ['4세대 실손', '노후 실손'] },
  { id: 'term', label: '정기', icon: Calendar, subTypes: ['순수 보장형', '환급형'] },
  { id: 'pension', label: '연금/연금저축', icon: PiggyBank, subTypes: ['세액 공제형', '비과세형'] },
  { id: 'driver', label: '운전자/상해', icon: Car, subTypes: ['민사/형사 책임', '응급실 내원'] },
  { id: 'fire', label: '주택화재', icon: Home, subTypes: ['도난 보장', '풍수해'] },
  { id: 'dementia', label: '치매', icon: Brain, subTypes: ['경증 치매', '중증 간병'] },
  { id: 'variable', label: '변액/변액연금', icon: Activity, subTypes: ['수익률 중점', '안정적 운용'] },
];

export const InsuranceSelector: React.FC = () => {
  const [selectedMain, setSelectedMain] = useState('cancer');
  const [selectedSub, setSelectedSub] = useState(0);

  const currentCategory = CATEGORIES.find(c => c.id === selectedMain);

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-6 bg-white font-sans">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest">
          국내 35개 전 보험사 실시간 비교
        </div>
        <div className="flex flex-col gap-4 w-full opacity-90 transition-opacity hover:opacity-100">
          <img src="/insurance_logos_1.png" alt="Insurers" className="w-full h-auto object-contain" />
          <img src="/insurance_logos_2.png" alt="Insurers" className="w-full h-auto object-contain" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-10 tracking-tight">어떤 보험이 궁금하세요?</h2>
      
      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-8 gap-x-4 mb-14">
        {CATEGORIES.map((item) => {
          const isSelected = selectedMain === item.id;
          return (
            <div key={item.id} className="flex flex-col items-center">
              <motion.button
                onClick={() => {
                  setSelectedMain(item.id);
                  setSelectedSub(0);
                }}
                className={`relative w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300
                  ${isSelected ? 'shadow-[0_10px_30px_-5px_rgba(255,107,0,0.2)]' : 'bg-[#F9FAFB] hover:bg-gray-100'}
                `}
              >
                {/* Active Border Effect */}
                {isSelected && (
                  <motion.div 
                    layoutId="active-border"
                    className="absolute inset-0 border-2 border-[#FF6B00] rounded-[2rem]"
                    initial={false}
                  >
                    <div className="absolute -inset-1 border border-[#FF6B00] opacity-30 rounded-[2.2rem]" />
                  </motion.div>
                )}
                
                <div className={`mb-1 p-2 rounded-xl ${isSelected ? 'bg-[#FFF0E5]' : 'text-gray-400'}`}>
                  <item.icon size={26} color={isSelected ? '#FF6B00' : 'currentColor'} strokeWidth={1.5} />
                </div>
                <span className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Sub Category Section */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedMain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-[#F9FAFB]/50 rounded-[2.5rem] p-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">상세타입을 선택해 보세요</h3>
          <div className="flex flex-wrap gap-3">
            {currentCategory?.subTypes?.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSub(idx)}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 border
                  ${selectedSub === idx 
                    ? 'border-[#FF6B00] text-[#FF6B00] bg-white' 
                    : 'border-transparent text-gray-400 bg-white hover:border-gray-200'}
                `}
              >
                {sub}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
