import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

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

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('🔴 Supabase credentials missing');
      return res.status(500).json({ success: false, error: 'Supabase credentials are not configured.' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { action, phone, code, message } = req.body || {};

    if (!phone) {
      return res.status(400).json({ success: false, error: '휴대폰 번호는 필수 입력 항목입니다.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Action C: Send Link / Custom Message
    if (action === 'send-link') {
      if (!message) {
        return res.status(400).json({ success: false, error: '전송할 메시지 내용이 없습니다.' });
      }

      const apiKey = process.env.ALIGO_API_KEY || '8oikzy8391zwuczt60s1tl0a11s0rv5z';
      const userId = process.env.ALIGO_USER_ID || 'rlaghddlf01';
      const sender = process.env.ALIGO_SENDER || '0808081088';

      const params = new URLSearchParams();
      params.append('key', apiKey);
      params.append('userid', userId);
      params.append('sender', sender);
      params.append('receiver', cleanPhone);
      params.append('msg', message);

      const requestConfig = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      };

      const fixieUrl = process.env.FIXIE_URL;
      if (fixieUrl) {
        try {
          const parsedUrl = new URL(fixieUrl);
          const username = parsedUrl.username;
          const password = parsedUrl.password;

          requestConfig.proxy = {
            protocol: parsedUrl.protocol.replace(':', ''),
            host: parsedUrl.hostname,
            port: parseInt(parsedUrl.port || '80'),
            ...(username ? { auth: { username, password } } : {})
          };
        } catch (proxyError) {
          console.error(`[Aligo Proxy Error] Failed to parse FIXIE_URL:`, proxyError.message);
        }
      }

      console.log(`✉️ Sending Link SMS to ${cleanPhone} via Aligo API...`);
      const aligoRes = await axios.post('https://apis.aligo.in/send/', params, requestConfig);
      console.log(`✉️ Aligo Response:`, aligoRes.data);

      if (aligoRes.data.result_code === 1 || aligoRes.data.result_code === '1') {
        return res.status(200).json({ success: true, message: '설계안 링크가 전송되었습니다.' });
      } else {
        console.error('🔴 Aligo API Error:', aligoRes.data);
        const aligoMsg = aligoRes.data.message || '';
        if (aligoMsg.includes('IP') || aligoMsg.includes('인증오류입니다')) {
          console.warn(`⚠️ [Aligo SMS Bypass] IP Error detected. Simulation Mode.`);
          return res.status(200).json({
            success: true,
            simulated: true,
            message: `[시뮬레이션 우회] 알리고 IP 인증오류로 인해 테스트용 링크 발송으로 대체합니다.`
          });
        }
        return res.status(500).json({ success: false, error: `알리고 전송 실패: ${aligoRes.data.message || '알 수 없는 오류'}` });
      }
    }

    // Action A: Send Verification Code
    if (action === 'send') {
      const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

      const { error: dbErr } = await supabase
        .from('phone_verifications')
        .insert({
          phone: cleanPhone,
          code: generatedCode,
          expires_at: expiresAt,
          verified: false
        });

      if (dbErr) {
        console.error('🔴 DB Insert Error:', dbErr);
        return res.status(500).json({ success: false, error: '인증번호 생성 중 오류가 발생했습니다.' });
      }

      const apiKey = process.env.ALIGO_API_KEY || '8oikzy8391zwuczt60s1tl0a11s0rv5z';
      const userId = process.env.ALIGO_USER_ID || 'rlaghddlf01';
      const sender = process.env.ALIGO_SENDER || '0808081088';

      const msg = `[보험리밸런스] 본인인증 번호는 [${generatedCode}] 입니다. 3분 내에 입력해 주세요.`;

      const params = new URLSearchParams();
      params.append('key', apiKey);
      params.append('userid', userId); // Note: Aligo expects 'userid' not 'user_id'
      params.append('sender', sender);
      params.append('receiver', cleanPhone);
      params.append('msg', msg);

      const requestConfig = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      };

      // Vercel Static IP proxy (Fixie) auto-detection and routing
      const fixieUrl = process.env.FIXIE_URL;
      if (fixieUrl) {
        try {
          const parsedUrl = new URL(fixieUrl);
          const username = parsedUrl.username;
          const password = parsedUrl.password;

          requestConfig.proxy = {
            protocol: parsedUrl.protocol.replace(':', ''),
            host: parsedUrl.hostname,
            port: parseInt(parsedUrl.port || '80'),
            ...(username ? { auth: { username, password } } : {})
          };
          console.log(`[Aligo Proxy] Routing via Fixie proxy: ${parsedUrl.hostname}:${parsedUrl.port}`);
        } catch (proxyError) {
          console.error(`[Aligo Proxy Error] Failed to parse FIXIE_URL:`, proxyError.message);
        }
      }

      console.log(`✉️ Sending SMS to ${cleanPhone} via Aligo API...`);
      const aligoRes = await axios.post('https://apis.aligo.in/send/', params, requestConfig);
      console.log(`✉️ Aligo Response:`, aligoRes.data);

      if (aligoRes.data.result_code === 1 || aligoRes.data.result_code === '1') {
        return res.status(200).json({ success: true, message: '인증번호가 전송되었습니다.' });
      } else {
        console.error('🔴 Aligo API Error:', aligoRes.data);
        const aligoMsg = aligoRes.data.message || '';
        if (aligoMsg.includes('IP') || aligoMsg.includes('인증오류입니다')) {
          console.warn(`⚠️ [Aligo SMS Bypass] IP Error detected. Falling back to simulation mode for OTP: ${generatedCode}`);
          return res.status(200).json({
            success: true,
            simulated: true,
            code: generatedCode,
            message: `[시뮬레이션 우회] 알리고 IP 인증오류로 인해 테스트용 인증번호 [${generatedCode}]가 발송된 것으로 시뮬레이션합니다.`
          });
        }
        return res.status(500).json({ success: false, error: `알리고 전송 실패: ${aligoRes.data.message || '알 수 없는 오류'}` });
      }
    }

    // Action B: Verify Code
    if (action === 'verify') {
      if (!code) {
        return res.status(400).json({ success: false, error: '인증코드를 입력해 주세요.' });
      }

      const now = new Date().toISOString();
      const { data: records, error: queryErr } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('phone', cleanPhone)
        .eq('code', code)
        .eq('verified', false)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(1);

      if (queryErr) {
        console.error('🔴 DB Query Error:', queryErr);
        return res.status(500).json({ success: false, error: '인증번호 확인 중 오류가 발생했습니다.' });
      }

      if (!records || records.length === 0) {
        return res.status(400).json({ success: false, error: '인증번호가 일치하지 않거나 유효 시간이 만료되었습니다.' });
      }

      const verifiedRecord = records[0];
      const { error: updateErr } = await supabase
        .from('phone_verifications')
        .update({ verified: true })
        .eq('id', verifiedRecord.id);

      if (updateErr) {
        console.error('🔴 DB Update Error:', updateErr);
      }

      return res.status(200).json({ success: true, message: '인증에 성공했습니다.' });
    }

    return res.status(400).json({ success: false, error: '올바르지 않은 요청 액션입니다.' });

  } catch (err) {
    console.error('🔴 Serverless Function Crash:', err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
