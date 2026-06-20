import re

file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's perform the replacement for handleSaveProfile validation, updatedBranding, planners mapping and plannerData payload
# 1. Validation checks
target_val = """    if (!editCustomAddress || editCustomAddress.trim() === '') {
      alert("지점 주소 및 인증 문구는 필수 입력 항목입니다. (예: 더윤컴퍼니 공식 인증 설계사 또는 서울시 강남구 테헤란로 123)");
      return;
    }"""

replacement_val = """    if (!editPlannerName || editPlannerName.trim() === '') {
      alert("설계사 이름은 필수 입력 항목입니다.");
      return;
    }
    if (!editCustomAddress || editCustomAddress.trim() === '') {
      alert("지점 주소는 필수 입력 항목입니다. (예: 서울시 강남구 테헤란로 123)");
      return;
    }"""

content = content.replace(target_val, replacement_val)

# 2. updatedBranding mapping
target_brand = """      const updatedBranding = {
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
      };"""

replacement_brand = """      const updatedBranding = {
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
      };"""

content = content.replace(target_brand, replacement_brand)

# 3. test planners mapping
target_test = """        setPlanners(prev => prev.map(p => p.id === currentUser.plannerId ? {
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
        } : p));"""

replacement_test = """        setPlanners(prev => prev.map(p => p.id === currentUser.plannerId ? {
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
        } : p));"""

content = content.replace(target_test, replacement_test)

# 4. plannerData payload
target_pdata = """      const plannerData = {
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

replacement_pdata = """      const plannerData = {
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

content = content.replace(target_pdata, replacement_pdata)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Saving logic in AdminDashboard.tsx updated successfully!")
