import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase client with Service Role Key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 2. Parse request body
    const body = await req.json();
    const { action, phone, code } = body;

    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, error: "휴대폰 번호는 필수 입력 항목입니다." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Clean phone number (remove hyphens, spaces)
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Action A: Send Verification Code
    if (action === 'send') {
      // Generate a 6-digit random code
      const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // 3 minutes expiration

      // Insert into phone_verifications table
      const { error: dbErr } = await supabase
        .from('phone_verifications')
        .insert({
          phone: cleanPhone,
          code: generatedCode,
          expires_at: expiresAt,
          verified: false
        });

      if (dbErr) {
        console.error("🔴 DB Insert Error:", dbErr);
        return new Response(
          JSON.stringify({ success: false, error: "인증번호 생성 중 오류가 발생했습니다." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      // Aligo API credentials (from environment variables or fallbacks)
      const aligoApiKey = Deno.env.get('ALIGO_API_KEY') || '8oikzy8391zwuczt60s1tl0a11s0rv5z';
      const aligoUserId = Deno.env.get('ALIGO_USER_ID') || 'rlaghddlf01';
      const aligoSender = Deno.env.get('ALIGO_SENDER') || '0808081088'; 

      // Build Aligo API payload
      const formData = new URLSearchParams();
      formData.append('key', aligoApiKey);
      formData.append('userid', aligoUserId);
      formData.append('sender', aligoSender);
      formData.append('receiver', cleanPhone);
      formData.append('msg', `[보험리밸런스] 본인인증 번호는 [${generatedCode}] 입니다. 3분 내에 입력해 주세요.`);
      
      // Send REST request to Aligo
      console.log(`✉️ Sending SMS to ${cleanPhone} with code ${generatedCode}`);
      const aligoRes = await fetch('https://apis.aligo.in/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      const aligoData = await aligoRes.json();
      console.log("✉️ Aligo Response:", aligoData);

      // result_code "1" means success in Aligo API
      if (aligoData.result_code === '1' || aligoData.result_code === 1) {
        return new Response(
          JSON.stringify({ success: true, message: "인증번호가 전송되었습니다." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } else {
        console.error("🔴 Aligo API Error:", aligoData);
        return new Response(
          JSON.stringify({ success: false, error: `알리고 전송 실패: ${aligoData.message || '알 수 없는 오류'}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Action B: Verify Verification Code
    if (action === 'verify') {
      if (!code) {
        return new Response(
          JSON.stringify({ success: false, error: "인증코드를 입력해 주세요." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Query database for valid matching code
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
        console.error("🔴 DB Query Error:", queryErr);
        return new Response(
          JSON.stringify({ success: false, error: "인증번호 확인 중 오류가 발생했습니다." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      if (!records || records.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "인증번호가 일치하지 않거나 유효 시간이 만료되었습니다." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Mark the code as verified
      const verifiedRecord = records[0];
      const { error: updateErr } = await supabase
        .from('phone_verifications')
        .update({ verified: true })
        .eq('id', verifiedRecord.id);

      if (updateErr) {
        console.error("🔴 DB Update Error:", updateErr);
      }

      return new Response(
        JSON.stringify({ success: true, message: "인증에 성공했습니다." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Invalid Action
    return new Response(
      JSON.stringify({ success: false, error: "올바르지 않은 요청 액션입니다." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (err: any) {
    console.error("🔴 Edge Function Crash:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || String(err) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
