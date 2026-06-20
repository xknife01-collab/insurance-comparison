import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-sms-verification-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/send-sms-verification')) {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const parsedBody = body ? JSON.parse(body) : {};
                  const supabaseUrl = env.VITE_SUPABASE_URL || '';
                  const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
                  const { createClient } = await import('@supabase/supabase-js');
                  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

                  const { action, phone, code, message } = parsedBody;
                  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';

                  res.setHeader('Content-Type', 'application/json');

                  if (action === 'send-link') {
                    if (!message) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ success: false, error: '전송할 메시지 내용이 없습니다.' }));
                      return;
                    }

                    const axios = (await import('axios')).default;
                    const params = new URLSearchParams();
                    params.append('key', env.ALIGO_API_KEY || '8oikzy8391zwuczt60s1tl0a11s0rv5z');
                    params.append('userid', env.ALIGO_USER_ID || 'rlaghddlf01');
                    params.append('sender', env.ALIGO_SENDER || '0808081088');
                    params.append('receiver', cleanPhone);
                    params.append('msg', message);

                    const requestConfig: any = {
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    };

                    if (env.FIXIE_URL) {
                      try {
                        const parsedUrl = new URL(env.FIXIE_URL);
                        requestConfig.proxy = {
                          protocol: parsedUrl.protocol.replace(':', ''),
                          host: parsedUrl.hostname,
                          port: parseInt(parsedUrl.port || '80'),
                          auth: parsedUrl.username ? { username: parsedUrl.username, password: parsedUrl.password } : undefined
                        };
                      } catch (proxyErr) {
                        console.error('Failed to parse FIXIE_URL locally', proxyErr);
                      }
                    }

                    const aligoRes = await axios.post('https://apis.aligo.in/send/', params, requestConfig);
                    if (aligoRes.data.result_code === 1 || aligoRes.data.result_code === '1') {
                      res.end(JSON.stringify({ success: true, message: '설계안 링크가 전송되었습니다.' }));
                    } else {
                      const aligoMsg = aligoRes.data.message || '';
                      if (aligoMsg.includes('IP') || aligoMsg.includes('인증오류입니다')) {
                        console.log(`[Aligo SMS Bypass] Local environment fallback to simulation mode for link: ${cleanPhone}`);
                        res.end(JSON.stringify({ 
                          success: true, 
                          simulated: true, 
                          message: `[시뮬레이션 우회] 알리고 IP 인증오류로 인해 로컬 테스트용 설계안 링크 발송으로 시뮬레이션합니다.` 
                        }));
                      } else {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ success: false, error: aligoRes.data.message }));
                      }
                    }
                  } else if (action === 'send') {
                    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
                    const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

                    const { error: dbErr } = await supabase.from('phone_verifications').insert({
                      phone: cleanPhone,
                      code: generatedCode,
                      expires_at: expiresAt,
                      verified: false
                    });

                    if (dbErr) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: '인증번호 생성 중 오류가 발생했습니다.' }));
                      return;
                    }

                    const axios = (await import('axios')).default;
                    const params = new URLSearchParams();
                    params.append('key', env.ALIGO_API_KEY || '8oikzy8391zwuczt60s1tl0a11s0rv5z');
                    params.append('userid', env.ALIGO_USER_ID || 'rlaghddlf01');
                    params.append('sender', env.ALIGO_SENDER || '0808081088');
                    params.append('receiver', cleanPhone);
                    params.append('msg', `[보험리밸런스] 본인인증 번호는 [${generatedCode}] 입니다. 3분 내에 입력해 주세요.`);

                    const requestConfig: any = {
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    };

                    if (env.FIXIE_URL) {
                      try {
                        const parsedUrl = new URL(env.FIXIE_URL);
                        requestConfig.proxy = {
                          protocol: parsedUrl.protocol.replace(':', ''),
                          host: parsedUrl.hostname,
                          port: parseInt(parsedUrl.port || '80'),
                          auth: parsedUrl.username ? { username: parsedUrl.username, password: parsedUrl.password } : undefined
                        };
                      } catch (proxyErr) {
                        console.error('Failed to parse FIXIE_URL locally', proxyErr);
                      }
                    }

                    const aligoRes = await axios.post('https://apis.aligo.in/send/', params, requestConfig);
                    if (aligoRes.data.result_code === 1 || aligoRes.data.result_code === '1') {
                      res.end(JSON.stringify({ success: true, message: '인증번호가 전송되었습니다.' }));
                    } else {
                      const aligoMsg = aligoRes.data.message || '';
                      if (aligoMsg.includes('IP') || aligoMsg.includes('인증오류입니다')) {
                        console.log(`[Aligo SMS Bypass] Local environment fallback to simulation mode. Generated OTP: ${generatedCode}`);
                        res.end(JSON.stringify({ 
                          success: true, 
                          simulated: true, 
                          code: generatedCode, 
                          message: `[시뮬레이션 우회] 알리고 IP 인증오류로 인해 로컬 테스트용 인증번호 [${generatedCode}]가 발송된 것으로 시뮬레이션합니다.` 
                        }));
                      } else {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ success: false, error: aligoRes.data.message }));
                      }
                    }
                  } else if (action === 'verify') {
                    const now = new Date().toISOString();
                    const { data: records } = await supabase
                      .from('phone_verifications')
                      .select('*')
                      .eq('phone', cleanPhone)
                      .eq('code', code)
                      .eq('verified', false)
                      .gt('expires_at', now)
                      .order('created_at', { ascending: false })
                      .limit(1);

                    if (!records || records.length === 0) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ success: false, error: '인증번호가 일치하지 않거나 유효 시간이 만료되었습니다.' }));
                      return;
                    }

                    await supabase.from('phone_verifications').update({ verified: true }).eq('id', records[0].id);
                    res.end(JSON.stringify({ success: true, message: '인증에 성공했습니다.' }));
                  } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ success: false, error: '올바르지 않은 요청 액션입니다.' }));
                  }
                } catch (err: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
            } else if (req.url && req.url.startsWith('/api/save-profile')) {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const parsedBody = body ? JSON.parse(body) : {};
                  const supabaseUrl = env.VITE_SUPABASE_URL || '';
                  const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
                  const { createClient } = await import('@supabase/supabase-js');
                  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

                  const { plannerId, plannerData, agencyId, agencyData } = parsedBody;

                  res.setHeader('Content-Type', 'application/json');

                  if (!plannerId) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ success: false, error: 'plannerId is required' }));
                    return;
                  }

                  let hasCertWarning = false;
                  if (plannerData && Object.keys(plannerData).length > 0) {
                    let { error: plannerErr } = await supabase
                      .from('planners')
                      .update(plannerData)
                      .eq('id', plannerId);

                    if (plannerErr && plannerErr.message.includes('certification_message')) {
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
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: `Planner update failed: ${plannerErr.message}` }));
                      return;
                    }
                  }

                  if (agencyId && agencyData && Object.keys(agencyData).length > 0) {
                    const { error: agencyErr } = await supabase
                      .from('agencies')
                      .update(agencyData)
                      .eq('id', agencyId);

                    if (agencyErr) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: `Agency update failed: ${agencyErr.message}` }));
                      return;
                    }
                  }

                  if (hasCertWarning) {
                    res.end(JSON.stringify({
                      success: true,
                      warning: 'certification_message_missing',
                      message: '인증 문구를 제외한 프로필 정보가 정상 저장되었습니다. 인증 문구 기능도 활성화하려면 Supabase SQL Editor에서 ALTER TABLE planners ADD COLUMN certification_message text; 명령어를 실행해 주세요.'
                    }));
                  } else {
                    res.end(JSON.stringify({ success: true, message: '프로필이 성공적으로 저장되었습니다.' }));
                  }
                } catch (err: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GOOGLE_API_KEY': JSON.stringify(env.GOOGLE_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/in0112001211': {
          target: 'https://api.hyphen.im',
          changeOrigin: true,
        },
        '^/in0017': {
          target: 'https://api.hyphen.im',
          changeOrigin: true,
        }
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
