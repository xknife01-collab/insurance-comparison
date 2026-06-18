import React, { useState, useEffect } from 'react';
import { 
  Play, BarChart2, Users, Settings, RefreshCw, 
  HelpCircle, AlertCircle, CheckCircle2, TrendingUp, DollarSign
} from 'lucide-react';

interface LeadDistributionSimulatorProps {
  planners: any[];
  agencies: any[];
  currentUser: any;
  showHelpGuide?: boolean;
  activeStrategy?: 'round_robin' | 'weighted' | 'activity';
}

export function LeadDistributionSimulator({ 
  planners, 
  agencies, 
  currentUser, 
  showHelpGuide = false,
  activeStrategy
}: LeadDistributionSimulatorProps) {
  // Determine if simulating agencies (Super Admin) or planners (Agency Admin)
  const isSuper = currentUser.role === 'super';
  const targetEntities = isSuper 
    ? agencies 
    : planners.filter(p => p.agency_id === currentUser.agencyId);

  const [leadCount, setLeadCount] = useState<number>(100);
  const [strategy, setStrategy] = useState<'round_robin' | 'weighted' | 'activity'>('round_robin');
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [simulatedLeads, setSimulatedLeads] = useState<any[]>([]);
  const [giniIndex, setGiniIndex] = useState<number>(0);
  const [maxMinGap, setMaxMinGap] = useState<number>(0);

  // Synchronize with activeStrategy prop when it changes
  useEffect(() => {
    if (activeStrategy) {
      setStrategy(activeStrategy);
    }
  }, [activeStrategy]);

  // Initialize weights
  useEffect(() => {
    const initialWeights: Record<string, number> = {};
    targetEntities.forEach(entity => {
      initialWeights[entity.id] = 10; // Default weight of 10
    });
    setWeights(initialWeights);
  }, [planners, agencies, currentUser]);

  const handleWeightChange = (id: string, val: number) => {
    setWeights(prev => ({
      ...prev,
      [id]: val
    }));
  };

  // Run lead distribution simulation
  const runSimulation = () => {
    if (targetEntities.length === 0) return;
    setIsSimulating(true);

    setTimeout(() => {
      const distResults: Record<string, number> = {};
      targetEntities.forEach(e => { distResults[e.id] = 0; });

      const newLeads: any[] = [];
      const leadTypes = ['내보험 분석', '자동차 비교', '실시간 정밀 진단', '카톡 다이어트'];
      const leadChannels = ['네이버 블로그', '인스타그램 광고', '구글 검색', '카카오 채널'];
      const mockFirstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
      const mockLastNames = ['민준', '서연', '도윤', '서현', '예준', '수아', '시우', '하은', '주원', '지아'];

      // Strategy 1: Round-Robin
      if (strategy === 'round_robin') {
        for (let i = 0; i < leadCount; i++) {
          const entity = targetEntities[i % targetEntities.length];
          distResults[entity.id] += 1;

          newLeads.push({
            id: `sim-lead-${i}`,
            name: `${mockFirstNames[Math.floor(Math.random() * mockFirstNames.length)]}*${mockLastNames[Math.floor(Math.random() * mockLastNames.length)]}`,
            type: leadTypes[Math.floor(Math.random() * leadTypes.length)],
            channel: leadChannels[Math.floor(Math.random() * leadChannels.length)],
            assignedTo: entity.name,
            reason: `순차 순환(Round-Robin) 배정 규칙 적용`
          });
        }
      } 
      // Strategy 2: Weighted
      else if (strategy === 'weighted') {
        const totalWeight = targetEntities.reduce((sum, e) => sum + (weights[e.id] || 10), 0);
        
        for (let i = 0; i < leadCount; i++) {
          let rand = Math.random() * totalWeight;
          let selectedEntity = targetEntities[0];

          for (const entity of targetEntities) {
            const w = weights[entity.id] || 10;
            if (rand < w) {
              selectedEntity = entity;
              break;
            }
            rand -= w;
          }

          distResults[selectedEntity.id] += 1;
          newLeads.push({
            id: `sim-lead-${i}`,
            name: `${mockFirstNames[Math.floor(Math.random() * mockFirstNames.length)]}*${mockLastNames[Math.floor(Math.random() * mockLastNames.length)]}`,
            type: leadTypes[Math.floor(Math.random() * leadTypes.length)],
            channel: leadChannels[Math.floor(Math.random() * leadChannels.length)],
            assignedTo: selectedEntity.name,
            reason: `가중치 비율 배정 (비중: ${((weights[selectedEntity.id] || 10) / totalWeight * 100).toFixed(1)}%)`
          });
        }
      } 
      // Strategy 3: Activity/Performance
      else {
        // Mock activity scores (conversion rate + response time)
        const activityScores: Record<string, number> = {};
        targetEntities.forEach((entity, idx) => {
          // Generate deterministic but unique activity rating
          activityScores[entity.id] = 40 + (idx * 15) % 60; 
        });

        const totalScore = targetEntities.reduce((sum, e) => sum + activityScores[e.id], 0);

        for (let i = 0; i < leadCount; i++) {
          let rand = Math.random() * totalScore;
          let selectedEntity = targetEntities[0];

          for (const entity of targetEntities) {
            const score = activityScores[entity.id];
            if (rand < score) {
              selectedEntity = entity;
              break;
            }
            rand -= score;
          }

          distResults[selectedEntity.id] += 1;
          newLeads.push({
            id: `sim-lead-${i}`,
            name: `${mockFirstNames[Math.floor(Math.random() * mockFirstNames.length)]}*${mockLastNames[Math.floor(Math.random() * mockLastNames.length)]}`,
            type: leadTypes[Math.floor(Math.random() * leadTypes.length)],
            channel: leadChannels[Math.floor(Math.random() * leadChannels.length)],
            assignedTo: selectedEntity.name,
            reason: `응대 활성 점수 기반 배정 (점수: ${activityScores[selectedEntity.id]}점)`
          });
        }
      }

      // Calculate Gini Coefficient
      const values = Object.values(distResults).sort((a, b) => a - b);
      const n = values.length;
      let absoluteSum = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          absoluteSum += Math.abs(values[i] - values[j]);
        }
      }
      const mean = values.reduce((sum, v) => sum + v, 0) / n;
      const gini = mean > 0 ? absoluteSum / (2 * n * n * mean) : 0;

      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);

      setResults(distResults);
      setSimulatedLeads(newLeads);
      setGiniIndex(Number(gini.toFixed(3)));
      setMaxMinGap(maxVal - minVal);
      setIsSimulating(false);
    }, 400); // Fast simulation response within 0.1s feeling
  };

  // Run automatically on load or target entity changes
  useEffect(() => {
    if (targetEntities.length > 0 && Object.keys(results).length === 0) {
      runSimulation();
    }
  }, [targetEntities]);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-8 space-y-6 text-left relative overflow-hidden">
      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: DB 분배 시뮬레이터</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "📊 광고 유입으로 들어온 DB가 설정한 가중치와 배정 알고리즘에 따라 구성원들에게 공평하게 할당되는지 미리 검증할 수 있는 가상 시뮬레이터입니다."
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            📊 실시간 DB 분배 시뮬레이터
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            대리점 내 플래너들에게 리드가 자동 배정되는 통계 분포를 실시간으로 예측합니다.
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={isSimulating || targetEntities.length === 0}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/10 flex items-center gap-2 cursor-pointer transition-all self-stretch sm:self-auto justify-center"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          시뮬레이터 실행 (0.1초)
        </button>
      </div>

      {targetEntities.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          시뮬레이션을 실행할 대상({isSuper ? '대리점' : '설계사'})이 존재하지 않습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">⚙️ 시뮬레이션 매개변수</span>
              
              {/* Lead Count Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <label>가상 유입 DB 개수</label>
                  <span className="text-orange-500">{leadCount}개</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={leadCount}
                  onChange={(e) => setLeadCount(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-900 rounded-lg appearance-none"
                />
              </div>

              {/* Strategy Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">분배 방식 알고리즘</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setStrategy('round_robin')}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${strategy === 'round_robin' ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="font-extrabold flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                      균등 순차 분배 (Round-Robin)
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      모든 플래너에게 차례대로 1건씩 순환하여 똑같이 배정합니다.
                    </p>
                  </button>

                  <button
                    onClick={() => setStrategy('weighted')}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${strategy === 'weighted' ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="font-extrabold flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-orange-500" />
                      가중치 기반 비율 분배
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      각 플래너별로 할당된 가중치(영업 지수) 비율만큼 확률 분배합니다.
                    </p>
                  </button>

                  <button
                    onClick={() => setStrategy('activity')}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${strategy === 'activity' ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="font-extrabold flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                      응대 속도 & 실적 기반 분배
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      실시간 응답 속도 및 계약 건수가 우수한 구성원에게 우선 할당합니다.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Weights Adjuster (only visible in Weighted mode) */}
            {strategy === 'weighted' && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 max-h-[300px] overflow-y-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">🎯 구성원 가중치 조정</span>
                <div className="space-y-3.5">
                  {targetEntities.map(entity => (
                    <div key={entity.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-350">
                        <span>{entity.name}</span>
                        <span className="text-orange-400">{weights[entity.id] || 10}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={weights[entity.id] || 10}
                        onChange={(e) => handleWeightChange(entity.id, Number(e.target.value))}
                        className="w-full accent-orange-500 cursor-pointer h-1 bg-slate-900 rounded-lg appearance-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Visual Chart Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Inequality Metrics Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-2xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 flex-shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">지니 계수 (분배 불평등도)</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-white">{giniIndex}</span>
                    <span className={`text-[9px] font-bold ${giniIndex < 0.1 ? 'text-emerald-400' : giniIndex < 0.25 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {giniIndex < 0.1 ? '균형 잡힌 균등' : giniIndex < 0.25 ? '양호한 균등' : '불평등 격차'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-2xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">최대-최소 격차</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-white">{maxMinGap}개</span>
                    <span className="text-[9px] text-slate-400 font-semibold">리드 수 기준</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="bg-slate-950 p-6 border border-slate-850 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">📊 배정 결과 분포도</span>
                <span className="text-[10px] text-slate-500 font-semibold">총 {leadCount}개 중 배정 수</span>
              </div>

              <div className="space-y-4 pt-2">
                {targetEntities.map(entity => {
                  const count = results[entity.id] || 0;
                  const pct = leadCount > 0 ? (count / leadCount) * 100 : 0;
                  
                  return (
                    <div key={entity.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-extrabold">
                        <span className="text-slate-200">{entity.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500">{count}개</span>
                          <span className="text-slate-500 text-[10px] font-bold">({pct.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-900/80 rounded-full h-3.5 relative overflow-hidden border border-slate-850">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mock Lead Log */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">📋 가상 배정 이력 로그 (최근 5개)</span>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 정상 시뮬레이션 완료
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-slate-400 font-bold">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 text-left">
                      <th className="pb-2">고객명</th>
                      <th className="pb-2">유형</th>
                      <th className="pb-2">채널</th>
                      <th className="pb-2">배정 대상</th>
                      <th className="pb-2 text-right">배정 사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulatedLeads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="border-b border-slate-900/50 last:border-0">
                        <td className="py-2 text-slate-200">{lead.name}</td>
                        <td className="py-2 text-orange-400">{lead.type}</td>
                        <td className="py-2 text-slate-500">{lead.channel}</td>
                        <td className="py-2 text-slate-350 font-black">{lead.assignedTo}</td>
                        <td className="py-2 text-right text-slate-450 font-medium">{lead.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
