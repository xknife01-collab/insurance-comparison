import React from 'react';
import { AnalysisResult } from '../types/insurance';
import { CancerSlider } from './insurance/cancer/CancerSlider';
import { BrainSlider } from './insurance/brain/BrainSlider';
import { HeartSlider } from './insurance/heart/HeartSlider';
import { SilsonSlider } from './insurance/silson/SilsonSlider';
import { DentalSlider } from './insurance/dental/DentalSlider';
import { PreExistingSlider } from './insurance/preExisting/PreExistingSlider';
import { CaregivingSlider } from './insurance/caregiving/CaregivingSlider';
import { CaregivingOldSlider } from './insurance/caregiving/CaregivingOldSlider';
import { NursingSlider } from './insurance/nursing/NursingSlider';
import { SurgerySlider } from './insurance/surgery/SurgerySlider';
import { HealthSlider } from './insurance/health/HealthSlider';
import { ChildSlider } from './insurance/child/ChildSlider';
import { DriverSlider } from './insurance/driver/DriverSlider';
import { PetSlider } from './insurance/pet/PetSlider';
import { GolfSlider } from './insurance/golf/GolfSlider';
import { FireSlider } from './insurance/fire/FireSlider';
import { PropertySlider } from './insurance/property/PropertySlider';
import { AnnuitySlider } from './insurance/annuity/AnnuitySlider';
import { WholeLifeSlider } from './insurance/wholeLife/WholeLifeSlider';
import { VariableSlider } from './insurance/variable/VariableSlider';
import { LegalSlider } from './insurance/legal/LegalSlider';
import { SavingsSlider } from './insurance/savings/SavingsSlider';
import { SavingsExplanation } from './insurance/savings/SavingsExplanation';
import { CreditSlider } from './insurance/credit/CreditSlider';
import { CarSlider } from './insurance/car/CarSlider';
import { HealthGeneralSlider } from './insurance/healthGeneral/HealthGeneralSlider';
import { AccidentSlider } from './insurance/accident/AccidentSlider';


interface SimulationSliderProps {
  result: AnalysisResult;
}

// ─── 슬라이더 컴포넌트 1:1 맵 ─────────────────────────────────────────────
type SliderComponentType = React.ComponentType<{ result: AnalysisResult }>;

// 정확한 키(exact match) 맵
const EXACT_SLIDER_MAP: Record<string, SliderComponentType> = {
  'child':            ChildSlider,
  'accident':         AccidentSlider,
  'car':              CarSlider,
  'driver':           DriverSlider,
  'pet':              PetSlider,
  'golf':             GolfSlider,
  'fire_real':        FireSlider,
  'annuity_savings':  AnnuitySlider,
  'whole':            WholeLifeSlider,
  'variable':         VariableSlider,
  'term':             VariableSlider,
  'health_general':   HealthGeneralSlider,
  'credit':           CreditSlider,
  'legal':            LegalSlider,
  'property':         PropertySlider,
  'home':             PropertySlider,
  'nursing':          NursingSlider,
  '재가/시설':         NursingSlider,
};

// 부분 문자열(includes) 맵 — 순서가 중요: 더 구체적인 것을 먼저
const PARTIAL_SLIDER_MAP: Array<[string, SliderComponentType | null]> = [
  ['종합건강',   HealthGeneralSlider],
  ['암',        CancerSlider],
  ['뇌혈관',    BrainSlider],
  ['심장',      HeartSlider],
  ['실손',      SilsonSlider],
  ['실비',      SilsonSlider],
  ['치아',      DentalSlider],
  ['상해',      AccidentSlider],
  ['치매',      CaregivingOldSlider],
  ['재가',      NursingSlider],
  ['시설',      NursingSlider],
  ['간병',      CaregivingSlider],
  ['수술',      SurgerySlider],
  ['입원',      SurgerySlider],
  ['운전자',    DriverSlider],
  ['펫',        PetSlider],
  ['자동차',    CarSlider],
  ['신용',      CreditSlider],
  ['골프',      GolfSlider],
  ['재물',      PropertySlider],
  ['주택화재',  FireSlider],
  ['화재',      FireSlider],
  ['연금',      AnnuitySlider],
  ['변액',      VariableSlider],
  ['정기',      VariableSlider],
  ['종신',      WholeLifeSlider],
  ['민사',      LegalSlider],
  ['형사',      LegalSlider],
  ['법률',      LegalSlider],
  ['어린이',    ChildSlider],
  ['태아',      ChildSlider],
  ['유병력자',  ChildSlider],
  ['유병자',    PreExistingSlider],
  ['간편',      PreExistingSlider],
  ['일반 저축', null], // 특수 처리 필요
];

export const SimulationSlider: React.FC<SimulationSliderProps> = ({ result }) => {
  const category = result.analysis.selectedCategory ?? '';

  // 일반 저축 — SavingsExplanation 추가 필요
  if (category.includes('일반 저축') || category === 'savings_general') {
    return (
      <div className="space-y-12">
        <SavingsSlider result={result} />
        <SavingsExplanation />
      </div>
    );
  }

  // 1. 정확한 키 매칭
  const ExactComponent = EXACT_SLIDER_MAP[category];
  if (ExactComponent) return <ExactComponent result={result} />;

  // 2. 부분 문자열 매칭 (순서 보장)
  const partialEntry = PARTIAL_SLIDER_MAP.find(([key, comp]) => comp !== null && category.includes(key));
  if (partialEntry) {
    const SliderComp = partialEntry[1] as SliderComponentType;
    return <SliderComp result={result} />;
  }

  // 3. 폴백: 일반 건강
  return <HealthSlider result={result} />;
};

export default SimulationSlider;

