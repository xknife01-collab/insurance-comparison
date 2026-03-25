/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HeartPulse, 
  User, 
  Baby, 
  Stethoscope, 
  Clock, 
  PiggyBank, 
  Car, 
  Home, 
  Brain, 
  TrendingUp,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

const INSURANCE_TYPES = [
  { id: 'cancer', label: '암', icon: <div className="p-3 bg-orange-100 rounded-2xl text-orange-600"><ShieldCheck className="w-8 h-8" /></div> },
  { id: 'surgery', label: '수술/입원비', icon: <HeartPulse className="w-8 h-8 text-gray-400" /> },
  { id: 'life', label: '종신', icon: <Clock className="w-8 h-8 text-gray-400" /> },
  { id: 'baby', label: '신생아', icon: <Baby className="w-8 h-8 text-gray-400" /> },
  { id: 'child', label: '어린이', icon: <Baby className="w-8 h-8 text-gray-400" /> },
  { id: 'pre-existing', label: '유병자', icon: <Stethoscope className="w-8 h-8 text-gray-400" /> },
  { id: 'medical', label: '의료실비', icon: <Stethoscope className="w-8 h-8 text-gray-400" /> },
  { id: 'term', label: '정기', icon: <Clock className="w-8 h-8 text-gray-400" /> },
  { id: 'pension', label: '연금/연금저축', icon: <PiggyBank className="w-8 h-8 text-gray-400" /> },
  { id: 'driver', label: '운전자/상해', icon: <Car className="w-8 h-8 text-gray-400" /> },
  { id: 'home', label: '주택화재', icon: <Home className="w-8 h-8 text-gray-400" /> },
  { id: 'dementia', label: '치매', icon: <Brain className="w-8 h-8 text-gray-400" /> },
  { id: 'variable', label: '변액/변액연금', icon: <TrendingUp className="w-8 h-8 text-gray-400" /> },
];

const ComparisonSection = () => {
  const [selectedType, setSelectedType] = useState('cancer');

  return (
    <section className="max-w-7xl mx-auto px-4 -mt-48 relative z-20">
      <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-12 grid lg:grid-cols-12 gap-16 border border-gray-50 overflow-hidden">
        
        {/* Left Grid */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb- aggregation px-2">어떤 보험이 궁금하세요?</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-8">
              {INSURANCE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex flex-col items-center justify-center aspect-square rounded-3xl border transition-all h-[110px] w-full ${
                    selectedType === type.id 
                      ? 'bg-white border-orange-500 shadow-[0_20px_40px_rgba(255,165,0,0.15)] ring-2 ring-orange-500 ring-offset-2' 
                      : 'bg-white border-gray-50 hover:border-gray-100 hover:shadow-lg'
                  }`}
                >
                  <div className="mb-2">{type.icon}</div>
                  <span className={`text-sm font-bold ${selectedType === type.id ? 'text-gray-900' : 'text-gray-400'}`}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 px-2">
            <h3 className="text-lg font-bold text-gray-800">상세타입을 선택해 보세요</h3>
            <div className="flex gap-4">
               <button className="px-8 py-3 rounded-full border-2 border-orange-500 bg-white text-orange-500 font-bold hover:bg-orange-50 transition-colors">
                 비갱신형 암보험
               </button>
               <button className="px-8 py-3 rounded-full border-2 border-gray-100 bg-white text-gray-400 font-bold hover:bg-gray-50 transition-colors">
                 갱신형 암보험
               </button>
            </div>
          </div>
        </div>

        {/* Right Form (Calculator Style as in image 1) */}
        <div className="lg:col-span-5 bg-white p-4">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-600 text-right">직접 입력 또는 간편로그인으로 계산할 수 있어요</h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-400 w-12">이름</span>
                  <input type="text" placeholder="김리치" className="bg-transparent font-bold flex-1 focus:outline-none" />
                </div>
                <div className="flex border border-gray-200 rounded-2xl overflow-hidden font-bold">
                  <button className="px-6 bg-gray-700 text-white">남</button>
                  <button className="px-6 text-gray-400">여</button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 w-16">생년월일</span>
                <input type="text" placeholder="예)19770101" className="bg-transparent font-bold flex-1 focus:outline-none" />
                <span className="text-sm text-gray-400">보험나이 <span className="text-orange-500">**세</span></span>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-400 w-12">연락처</span>
                  <input type="text" placeholder="010-12345678" className="bg-transparent font-bold flex-1 focus:outline-none" />
                </div>
                <button className="px-8 bg-gray-700 text-white rounded-2xl font-bold">인증</button>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" className="w-4 h-4 rounded accent-orange-500" />
                <span className="text-xs text-gray-600 font-bold">개인정보수집 및 활용동의 <span className="text-gray-400 underline">보기</span></span>
              </div>

              <button className="w-full bg-orange-500 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_15px_40px_-5px_rgba(255,165,0,0.5)] active:scale-95 transition-all">
                보험료 계산하기
              </button>

              <div className="relative flex items-center justify-center py-4">
                <div className="border-t border-gray-100 w-full"></div>
                <span className="bg-white px-4 text-xs font-bold text-gray-300 absolute">또는</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-[#FEE500] text-black py-5 rounded-[2.5rem] font-black text-sm shadow-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5 fill-current" /> 카카오로 계산
                </button>
                <button className="bg-[#03C75A] text-white py-5 rounded-[2.5rem] font-black text-sm shadow-sm flex items-center justify-center gap-2">
                  <span className="font-serif italic text-lg leading-none">N</span> 네이버로 계산
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
