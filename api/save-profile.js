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
    const { plannerId, plannerData, agencyId, agencyData } = req.body || {};

    if (!plannerId) {
      return res.status(400).json({ success: false, error: 'plannerId is required' });
    }

    // 1. Update Planner Data
    let hasCertWarning = false;
    if (plannerData && Object.keys(plannerData).length > 0) {
      let { error: plannerErr } = await supabase
        .from('planners')
        .update(plannerData)
        .eq('id', plannerId);

      if (plannerErr && plannerErr.message.includes('certification_message')) {
        console.warn('certification_message column missing, retrying without it...');
        const { certification_message, ...fallbackData } = plannerData;
        const { error: retryErr } = await supabase
          .from('planners')
          .update(fallbackData)
          .eq('id', plannerId);
        
        if (!retryErr) {
          hasCertWarning = true;
        } else {
          plannerErr = retryErr;
        }
      }

      if (plannerErr && !hasCertWarning) {
        console.error('Error updating planner:', plannerErr);
        return res.status(500).json({ success: false, error: `Planner update failed: ${plannerErr.message}` });
      }
    }

    // 2. Update Agency Data if agencyId and agencyData provided
    if (agencyId && agencyData && Object.keys(agencyData).length > 0) {
      const { error: agencyErr } = await supabase
        .from('agencies')
        .update(agencyData)
        .eq('id', agencyId);

      if (agencyErr) {
        console.error('Error updating agency:', agencyErr);
        return res.status(500).json({ success: false, error: `Agency update failed: ${agencyErr.message}` });
      }
    }

    if (hasCertWarning) {
      return res.status(200).json({
        success: true,
        warning: 'certification_message_missing',
        message: '인증 문구를 제외한 프로필 정보가 정상 저장되었습니다. 인증 문구 기능도 활성화하려면 Supabase SQL Editor에서 ALTER TABLE planners ADD COLUMN certification_message text; 명령어를 실행해 주세요.'
      });
    }

    return res.status(200).json({ success: true, message: '프로필이 성공적으로 저장되었습니다.' });

  } catch (err) {
    console.error('Serverless Function Crash:', err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
