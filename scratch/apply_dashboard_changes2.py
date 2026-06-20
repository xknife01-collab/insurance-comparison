import re

file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Planner interface
target1 = """interface Planner {
  id: string;
  agency_id?: string;
  planner_code: string;
  name: string;
  phone: string;
  is_admin: boolean;
  logo_url?: string;
  profile_image_url?: string;
  greeting_title?: string;
  greeting_content?: string;
  custom_phone?: string;
  custom_address?: string;
  kakao_link?: string;
  subscription_status: string;
  subscription_expires_at?: string;
  company_name?: string;
  registration_number?: string;
  email?: string;
}"""

replacement1 = """interface Planner {
  id: string;
  agency_id?: string;
  planner_code: string;
  name: string;
  phone: string;
  is_admin: boolean;
  logo_url?: string;
  profile_image_url?: string;
  greeting_title?: string;
  greeting_content?: string;
  custom_phone?: string;
  custom_address?: string;
  certification_message?: string;
  kakao_link?: string;
  subscription_status: string;
  subscription_expires_at?: string;
  company_name?: string;
  registration_number?: string;
  email?: string;
}"""

content = content.replace(target1, replacement1)

# 2. Add state hooks
target2 = """  const [editCompanyName, setEditCompanyName] = useState('');
  const [editRegistrationNumber, setEditRegistrationNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');"""

replacement2 = """  const [editCompanyName, setEditCompanyName] = useState('');
  const [editRegistrationNumber, setEditRegistrationNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCertificationMessage, setEditCertificationMessage] = useState('');
  const [editPlannerName, setEditPlannerName] = useState('');"""

content = content.replace(target2, replacement2)

# 3. Update fetchData pre-population
target3 = """          setEditCompanyName(myProfile.company_name || '');
          const rawRegNum = myProfile.registration_number || '';
          const delibPart = rawRegNum.includes('|') ? rawRegNum.split('|')[0] : (rawRegNum.startsWith('dist_') ? '' : rawRegNum);
          setEditRegistrationNumber(delibPart);
          setEditEmail(myProfile.email || '');"""

replacement3 = """          setEditCompanyName(myProfile.company_name || '');
          const rawRegNum = myProfile.registration_number || '';
          const delibPart = rawRegNum.includes('|') ? rawRegNum.split('|')[0] : (rawRegNum.startsWith('dist_') ? '' : rawRegNum);
          setEditRegistrationNumber(delibPart);
          setEditEmail(myProfile.email || '');
          setEditCertificationMessage(myProfile.certification_message || '');
          setEditPlannerName(myProfile.name || '');"""

content = content.replace(target3, replacement3)

# 4. Update handleSaveProfile validation & updatedBranding
target4 = """    if (!editCustomAddress || editCustomAddress.trim() === '') {
      alert("지점 주소 및 인증 문구는 필수 입력 항목입니다. (예: 더윤컴퍼니 공식 인증 설계사 또는 서울시 강남구 테헤란로 123)");
      return;
    }
    setLoading(true);
    try {
      const currentPlanner = planners.find(p => p.id === currentUser.plannerId);
      const rawRegNum = currentPlanner?.registration_number || '';
      const existingDistSetting = rawRegNum.includes('|') ? rawRegNum.split('|')[1] : (rawRegNum.startsWith('dist_') ? rawRegNum : '');
      const combinedRegistrationNumber = editRegistrationNumber ? (existingDistSetting ? `${editRegistrationNumber}|${existingDistSetting}` : editRegistrationNumber) : (existingDistSetting || '');

      const updatedBranding = {
        type: currentUser.role === 'agency' ? 'agency' as const : 'planner' as const,
        plannerId: currentUser.plannerId || null,
        agencyId: currentUser.agencyId || null,
        name: currentUser.name || '',
        profileImageUrl: editProfileImg || null,
        logoUrl: editLogoUrl || null,
        greetingTitle: editGreetingTitle || '',
        greetingContent: editGreetingContent || '',
        customPhone: editCustomPhone || '',
        customAddress: editCustomAddress || '',
        kakaoLink: editKakao || null,
        agencyName: editCompanyName || '',
        agencyAddress: editCustomAddress || '',
        registrationNumber: editRegistrationNumber || null,
        customEmail: editEmail || '',
        leadRoutingType: sessionStorage.getItem('demo_lead_routing_type') || null
      };

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setCurrentUser(prev => ({
          ...prev,
          name: editGreetingTitle ? `${editGreetingTitle} (${editCompanyName})` : prev.name
        }));
        setPlanners(prev => prev.map(p => p.id === currentUser.plannerId ? {
          ...p,
          kakao_link: editKakao,
          greeting_title: editGreetingTitle,
          greeting_content: editGreetingContent,
          profile_image_url: editProfileImg,
          logo_url: editLogoUrl,
          custom_phone: editCustomPhone,
          custom_address: editCustomAddress,
          password: editPassword,
          company_name: editCompanyName,
          registration_number: editRegistrationNumber,
          email: editEmail
        } : p));
        if (currentUser.role === 'agency' && currentUser.agencyId) {
          setAgencies(prev => prev.map(a => a.id === currentUser.agencyId ? {
            ...a,
            logo_url: editLogoUrl,
            email: editEmail
          } : a));
        }
        updateBranding(updatedBranding);
        setToastMessage("✨ 프로필 및 랜딩페이지 설정이 실시간 저장되었습니다! (데모)");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      const plannerData = {
        kakao_link: editKakao,
        greeting_title: editGreetingTitle,
        greeting_content: editGreetingContent,
        profile_image_url: editProfileImg,
        logo_url: editLogoUrl,
        custom_phone: editCustomPhone,
        custom_address: editCustomAddress,
        password: editPassword,
        company_name: editCompanyName,
        registration_number: combinedRegistrationNumber,
        email: editEmail
      };"""

replacement4 = """    if (!editPlannerName || editPlannerName.trim() === '') {
      alert("설계사 이름은 필수 입력 항목입니다.");
      return;
    }
    if (!editCustomAddress || editCustomAddress.trim() === '') {
      alert("지점 주소는 필수 입력 항목입니다. (예: 서울시 강남구 테헤란로 123)");
      return;
    }
    setLoading(true);
    try {
      const currentPlanner = planners.find(p => p.id === currentUser.plannerId);
      const rawRegNum_save = currentPlanner?.registration_number || '';
      const existingDistSetting = rawRegNum_save.includes('|') ? rawRegNum_save.split('|')[1] : (rawRegNum_save.startsWith('dist_') ? rawRegNum_save : '');
      const combinedRegistrationNumber = editRegistrationNumber ? (existingDistSetting ? `${editRegistrationNumber}|${existingDistSetting}` : editRegistrationNumber) : (existingDistSetting || '');

      const updatedBranding = {
        type: currentUser.role === 'agency' ? 'agency' as const : 'planner' as const,
        plannerId: currentUser.plannerId || null,
        agencyId: currentUser.agencyId || null,
        name: editPlannerName || currentUser.name || '',
        profileImageUrl: editProfileImg || null,
        logoUrl: editLogoUrl || null,
        greetingTitle: editGreetingTitle || '',
        greetingContent: editGreetingContent || '',
        customPhone: editCustomPhone || '',
        customAddress: editCustomAddress || '',
        certificationMessage: editCertificationMessage || null,
        kakaoLink: editKakao || null,
        agencyName: editCompanyName || '',
        agencyAddress: editCustomAddress || '',
        registrationNumber: editRegistrationNumber || null,
        customEmail: editEmail || '',
        leadRoutingType: sessionStorage.getItem('demo_lead_routing_type') || null
      };

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setCurrentUser(prev => ({
          ...prev,
          name: editGreetingTitle ? `${editGreetingTitle} (${editCompanyName})` : prev.name
        }));
        setPlanners(prev => prev.map(p => p.id === currentUser.plannerId ? {
          ...p,
          name: editPlannerName,
          kakao_link: editKakao,
          greeting_title: editGreetingTitle,
          greeting_content: editGreetingContent,
          profile_image_url: editProfileImg,
          logo_url: editLogoUrl,
          custom_phone: editCustomPhone,
          custom_address: editCustomAddress,
          certification_message: editCertificationMessage,
          password: editPassword,
          company_name: editCompanyName,
          registration_number: editRegistrationNumber,
          email: editEmail
        } : p));
        if (currentUser.role === 'agency' && currentUser.agencyId) {
          setAgencies(prev => prev.map(a => a.id === currentUser.agencyId ? {
            ...a,
            logo_url: editLogoUrl,
            email: editEmail
          } : a));
        }
        updateBranding(updatedBranding);
        setToastMessage("✨ 프로필 및 랜딩페이지 설정이 실시간 저장되었습니다! (데모)");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      const plannerData = {
        name: editPlannerName,
        kakao_link: editKakao,
        greeting_title: editGreetingTitle,
        greeting_content: editGreetingContent,
        profile_image_url: editProfileImg,
        logo_url: editLogoUrl,
        custom_phone: editCustomPhone,
        custom_address: editCustomAddress,
        certification_message: editCertificationMessage,
        password: editPassword,
        company_name: editCompanyName,
        registration_number: combinedRegistrationNumber,
        email: editEmail
      };"""

content = content.replace(target4, replacement4)

# 5. Insert "설계사 이름" input field after "로그인 ID" input field
target5 = """                      {/* 로그인 ID */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          로그인 ID
                        </label>
                        <input 
                          type="text"
                          value={currentUser.plannerCode || ''}
                          readOnly
                          className="w-full bg-slate-950/40 border border-slate-900 rounded-xl py-2.5 px-4 outline-none text-xs text-slate-500 font-bold cursor-not-allowed select-all"
                        />
                        <p className="text-[10px] text-slate-500 font-medium">
                          💡 해당 대시보드 로그인 시 사용하는 고유 식별 코드입니다. (수정 불가)
                        </p>
                      </div>"""

replacement5 = """                      {/* 로그인 ID */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          로그인 ID
                        </label>
                        <input 
                          type="text"
                          value={currentUser.plannerCode || ''}
                          readOnly
                          className="w-full bg-slate-950/40 border border-slate-900 rounded-xl py-2.5 px-4 outline-none text-xs text-slate-500 font-bold cursor-not-allowed select-all"
                        />
                        <p className="text-[10px] text-slate-500 font-medium">
                          💡 해당 대시보드 로그인 시 사용하는 고유 식별 코드입니다. (수정 불가)
                        </p>
                      </div>

                      {/* 설계사 이름 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          설계사 이름 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editPlannerName}
                          onChange={(e) => setEditPlannerName(e.target.value)}
                          placeholder="예: 홍길동"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>"""

content = content.replace(target5, replacement5)

# 6. Split "지점 주소 및 인증 문구" into separate inputs
target6 = """                      {/* Custom Address / Footer Description */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          지점 주소 및 인증 문구 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editCustomAddress}
                          onChange={(e) => setEditCustomAddress(e.target.value)}
                          placeholder="예: 서울시 강남구 테헤란로 123 (더윤컴퍼니 공식 인증 설계사)"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>"""

replacement6 = """                      {/* 지점 주소 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          지점 주소 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editCustomAddress}
                          onChange={(e) => setEditCustomAddress(e.target.value)}
                          placeholder="예: 서울시 강남구 테헤란로 123"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* 인증 문구 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          인증 문구 (선택 - 기입 시 하단 푸터 및 랜딩페이지에 상시 노출)
                        </label>
                        <input 
                          type="text"
                          value={editCertificationMessage}
                          onChange={(e) => setEditCertificationMessage(e.target.value)}
                          placeholder="예: 더윤컴퍼니 공식 인증 설계사"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        />
                      </div>"""

content = content.replace(target6, replacement6)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("AdminDashboard.tsx split inputs updated successfully!")
