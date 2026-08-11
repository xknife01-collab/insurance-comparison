/**
 * 앱 UI 정밀 입력 필드 및 고지사항(문진표) 전용 AI 정밀 해설 모듈
 * 
 * 고객이 앱 내에서 조작하는 입력 필드(진단비, 치아 고지사항, 수술비 종 수술 등)에 대해 질의했을 때
 * Supabase DB의 input_options_schema 및 premium_factor_matrix를 바탕으로
 * 필드의 의미, 선택지별 보장 차이, 인수(승인) 여부, 보험료 영향을 100% 정확하게 템플릿화합니다.
 */

export interface InputOptionItem {
  label: string;
  options: string[];
  default?: string;
  recommended?: string;
}

export function formatInputFieldExplanationContext(
  category: string,
  inputOptionsSchema: Record<string, InputOptionItem>,
  premiumFactorMatrix?: Record<string, any>
): string {
  if (!inputOptionsSchema || Object.keys(inputOptionsSchema).length === 0) {
    return '';
  }

  const lines: string[] = [];
  lines.push(`### 🎛️ [앱 화면 정밀 조작 입력 필드 & 문진표 해설 가이드] (카테고리: ${category})`);
  lines.push(`고객이 앱 화면에서 직접 선택하는 입력 필드 및 문진표 항목 정보입니다. 질문 시 아래 명세를 기반으로 선택지별 의미와 보험료/인수 영향을 설명하십시오:\n`);

  for (const [fieldKey, fieldObj] of Object.entries(inputOptionsSchema)) {
    if (!fieldObj || !fieldObj.label || !Array.isArray(fieldObj.options)) continue;

    lines.push(`• **항목명**: ${fieldObj.label}`);
    lines.push(`  - 선택 가능 옵션: [${fieldObj.options.join(', ')}]`);

    if (fieldObj.recommended) {
      lines.push(`  - 권장 추천 옵션: "${fieldObj.recommended}"`);
    }
    if (fieldObj.default) {
      lines.push(`  - 기본 선택값: "${fieldObj.default}"`);
    }

    // premium_factor_matrix와 연결된 금액 영향 정보 추출
    if (premiumFactorMatrix) {
      const deltaKey = `delta_${fieldKey}`;
      const deltaMap = premiumFactorMatrix[deltaKey];
      if (deltaMap && typeof deltaMap === 'object') {
        const deltaStr = Object.entries(deltaMap)
          .map(([optName, deltaVal]) => {
            const valNum = Number(deltaVal);
            if (isNaN(valNum) || valNum === 0) return `${optName}: 변동 없음`;
            const sign = valNum > 0 ? '+' : '';
            return `${optName}: ${sign}${valNum.toLocaleString()}원`;
          })
          .join(', ');
        lines.push(`  - 옵션별 실시간 보험료 변동 수치: ${deltaStr}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}
