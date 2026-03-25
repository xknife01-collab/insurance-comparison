/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Menu, Phone } from 'lucide-react';

const Header = () => (
  <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">GoodRich</span>
          <span className="text-xl font-medium text-gray-800">보험몰</span>
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 text-gray-600">
            <Phone className="w-5 h-5" />
            <span className="font-bold text-lg">080.808.1088</span>
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
            나의 라이프 플래너
          </button>
        </div>
      </div>
      <nav className="flex items-center gap-8 h-12 text-sm font-medium text-gray-700">
        <button className="flex items-center gap-1 font-bold">
          <Menu className="w-4 h-4" />
          보험종류
        </button>
        <button className="hover:text-orange-500">통합보험료계산</button>
        <button className="hover:text-orange-500">원스톱보험비교</button>
        <button className="hover:text-orange-500">고객센터</button>
      </nav>
    </div>
  </header>
);

export default Header;
