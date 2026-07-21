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
    let plannerWarning = false;
    let agencyWarning = false;
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
          plannerWarning = true;
        } else {
          plannerErr = retryErr;
        }
      }

      if (plannerErr && !plannerWarning) {
        console.error('Error updating planner:', plannerErr);
        return res.status(500).json({ success: false, error: `Planner update failed: ${plannerErr.message}` });
      }
    }

    // 2. Update Agency Data if agencyId and agencyData provided
    if (agencyId && agencyData && Object.keys(agencyData).length > 0) {
      let { error: agencyErr } = await supabase
        .from('agencies')
        .update(agencyData)
        .eq('id', agencyId);

      if (agencyErr && (agencyErr.message.includes('greeting_title') || agencyErr.message.includes('greeting_content'))) {
        console.warn('greeting_title or greeting_content column missing in agencies table, retrying without them...');
        const { greeting_title, greeting_content, ...fallbackAgencyData } = agencyData;
        const { error: retryErr } = await supabase
          .from('agencies')
          .update(fallbackAgencyData)
          .eq('id', agencyId);
        
        if (!retryErr) {
          agencyWarning = true;
        } else {
          agencyErr = retryErr;
        }
      }

      if (agencyErr) {
        console.error('Error updating agency:', agencyErr);
        return res.status(500).json({ success: false, error: `Agency update failed: ${agencyErr.message}` });
      }
    }

    if (plannerWarning || agencyWarning) {
      let warningMsg = '일부 커스텀 필드를 제외하고 프로필 정보가 정상 저장되었습니다.';
      if (plannerWarning) {
        warningMsg += '\n- [설계사] 인증 문구 기능 활성화를 위해 Supabase SQL Editor에서 다음 명령을 실행해 주세요: ALTER TABLE planners ADD COLUMN certification_message text;';
      }
      if (agencyWarning) {
        warningMsg += '\n- [대리점] 인사말 기능 활성화를 위해 Supabase SQL Editor에서 다음 명령을 실행해 주세요: ALTER TABLE agencies ADD COLUMN greeting_title text, ADD COLUMN greeting_content text;';
      }
      return res.status(200).json({
        success: true,
        warning: 'missing_columns',
        message: warningMsg
      });
    }

    return res.status(200).json({ success: true, message: '프로필이 성공적으로 저장되었습니다.' });

  } catch (err) {
    console.error('Serverless Function Crash:', err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
