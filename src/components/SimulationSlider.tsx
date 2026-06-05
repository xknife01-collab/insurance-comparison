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

export const SimulationSlider: React.FC<SimulationSliderProps> = ({ result }) => {
  const category = result.analysis.selectedCategory || '';

  // 종합건강보험 지원
  if (category.includes('종합건강') || category === 'health_general' || !!result.analysis.healthGeneral) {
    return <HealthGeneralSlider result={result} />;
  }

  if (category.includes('암') || category === 'cancer') return <CancerSlider result={result} />;
  if (category.includes('뇌혈관') || category === 'cerebrovascular') return <BrainSlider result={result} />;
  if (category.includes('심장')) return <HeartSlider result={result} />;
  if (category.includes('실손') || category.includes('실비')) return <SilsonSlider result={result} />;
  if (category.includes('치아')) return <DentalSlider result={result} />;
  if (category.includes('상해') || category === 'accident' || !!result.analysis.accident) return <AccidentSlider result={result} />;
  if (category.includes('치매')) return <CaregivingOldSlider result={result} />;
  if (category === 'nursing' || category.includes('재가') || category.includes('시설')) return <NursingSlider result={result} />;
  if (category.includes('간병')) return <CaregivingSlider result={result} />;
  if (category.includes('수술') || category.includes('입원')) return <SurgerySlider result={result} />;
  
  // 운전자보험 지원
  if (category.includes('운전자') || category === 'driver' || !!result.analysis.driver) return <DriverSlider result={result} />;

  // 펫보험 지원
  if (category.includes('펫') || category === 'pet') return <PetSlider result={result} />;

  // 자동차보험 지원
  if (category.includes('자동차') || category === 'car') return <CarSlider result={result} />;


  // 신용보험 지원
  if (category.includes('신용') || category === 'credit' || !!result.analysis.credit) return <CreditSlider result={result} />;

  // 골프보험 지원
  if (category.includes('골프') || category === 'golf') return <GolfSlider result={result} />;

  // 주택화재보험 지원
  if (category.includes('주택화재') || category.includes('화재') || category === 'fire_real') {
    return <FireSlider result={result} />;
  }

  // 연금저축보험 지원
  if (category.includes('연금') || category === 'annuity_savings') {
    return <AnnuitySlider result={result} />;
  }

  // 변액/정기보험 지원
  if (category.includes('변액') || category.includes('정기') || category === 'variable' || category === 'term' || !!result.analysis.variable) {
    return <VariableSlider result={result} />;
  }

  // 종신보험 지원
  if (category.includes('종신') || category === 'whole' || !!result.analysis.wholeLife) {
    return <WholeLifeSlider result={result} />;
  }

  // 법률비용보전보험 지원
  if (category.includes('법률') || category === 'legal' || !!result.analysis.legal) {
    return <LegalSlider result={result} />;
  }

  if (category.includes('일반 저축') || category === 'savings_general' || !!result.analysis.savingsGeneral) {
    return (
      <div className="space-y-12">
        <SavingsSlider result={result} />
        <SavingsExplanation />
      </div>
    );
  }


  // 어린이/태아 유병력자 (pre_family) — 반드시 어른 유병자보다 먼저 체크
  if (result.analysis.child?.isPreFamily || category.includes('유병력자')) return <ChildSlider result={result} />;
  if (category.includes('어린이') || category.includes('태아') || category === 'child') return <ChildSlider result={result} />;
  if (category.includes('유병') || category.includes('간편')) return <PreExistingSlider result={result} />;

  // 기타 보장 자산 및 Fallback
  return <HealthSlider result={result} />;
};

export default SimulationSlider;
