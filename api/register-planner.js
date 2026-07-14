import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Only POST method allowed' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return res.status(500).json({
        success: false,
        error: 'Supabase credentials missing on server.'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const {
      signupType,
      regName,
      regPhone,
      regCode,
      regPassword,
      regGreetingTitle,
      regGreetingContent,
      regProfileImg,
      regKakao,
      regCertificationMessage,
      invitedAgencyId,
      regAgencyName,
      regAgencyPhone,
      regAgencyAddress,
      regLogoUrl,
      regRoutingType,
      regAgencyTier
    } = req.body || {};

    if (!regName || !regPhone || !regCode) {
      return res.status(400).json({ success: false, error: 'Name, Phone, and Code are required.' });
    }

    const cleanCode = regCode.trim();

    // 1. Check for Duplicate Planner Code
    const { data: checkData, error: checkError } = await supabase
      .from('planners')
      .select('planner_code')
      .eq('planner_code', cleanCode);

    if (checkError) {
      console.error('Check duplicate error:', checkError);
    } else if (checkData && checkData.length > 0) {
      return res.status(400).json({ success: false, duplicate: true, error: '이미 사용 중인 설계사 코드입니다.' });
    }

    // 2. Check Agency Limit if Invited
    if (invitedAgencyId) {
      const { count, error: countErr } = await supabase
        .from('planners')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', invitedAgencyId)
        .eq('subscription_status', 'active');

      const { data: agencyData, error: agencyErr } = await supabase
        .from('agencies')
        .select('max_planner_limit, subscription_tier')
        .eq('id', invitedAgencyId)
        .single();

      if (!countErr && !agencyErr && agencyData) {
        const currentCount = count || 0;
        const limit = agencyData.max_planner_limit || 13;
        if (currentCount >= limit) {
          return res.status(400).json({
            success: false,
            limitExceeded: true,
            error: `[가입 제한] 해당 대리점의 요금제(${agencyData.subscription_tier?.toUpperCase() || 'BASIC'}) 설계사 등록 한도(${limit}명)를 초과하였습니다.`
          });
        }
      }
    }

    // 3. Register Agency if Agency Signup
    let agencyId = undefined;
    if (signupType === 'agency') {
      if (!regAgencyName || !regAgencyName.trim()) {
        return res.status(400).json({ success: false, error: '대리점명을 입력해 주세요.' });
      }

      const newAgency = {
        name: regAgencyName,
        phone: regAgencyPhone || regPhone,
        address: regAgencyAddress || '',
        logo_url: regLogoUrl || '',
        subscription_status: 'active',
        lead_routing_type: regRoutingType || 'direct',
        subscription_tier: regAgencyTier || 'basic',
        max_planner_limit: regAgencyTier === 'basic' ? 13 : regAgencyTier === 'pro' ? 28 : 150
      };

      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .insert(newAgency)
        .select()
        .single();

      if (agencyError || !agencyData) {
        return res.status(500).json({ success: false, error: '대리점 등록 실패: ' + agencyError?.message });
      }

      agencyId = agencyData.id;
    } else if (invitedAgencyId) {
      agencyId = invitedAgencyId;
    }

    // 4. Register Planner
    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 30);

    const newPlanner = {
      agency_id: agencyId,
      planner_code: cleanCode,
      password: (regPassword || '').trim(),
      name: regName,
      phone: regPhone,
      is_admin: signupType === 'agency',
      profile_image_url: regProfileImg || '',
      logo_url: regLogoUrl || '',
      greeting_title: regGreetingTitle || `${regName} 전문 자산관리사`,
      greeting_content: regGreetingContent || '정직하고 신뢰할 수 있는 무료 보장 진단 및 포트폴리오 리모델링을 지원합니다.',
      custom_phone: regPhone,
      custom_address: regAgencyAddress || (signupType === 'agency' ? '' : '인카금융서비스 소속 설계사'),
      company_name: regAgencyName || (signupType === 'agency' ? '' : '인카금융서비스'),
      kakao_link: regKakao || '',
      certification_message: regCertificationMessage || '',
      subscription_status: invitedAgencyId ? 'pending' : 'active',
      subscription_expires_at: trialExpiry.toISOString()
    };

    const { data: plannerData, error: plannerError } = await supabase
      .from('planners')
      .insert(newPlanner)
      .select()
      .single();

    if (plannerError || !plannerData) {
      return res.status(500).json({ success: false, error: '설계사 등록 실패: ' + plannerError?.message });
    }

    return res.status(200).json({
      success: true,
      planner: plannerData
    });

  } catch (err) {
    console.error('Serverless Function Crash:', err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
