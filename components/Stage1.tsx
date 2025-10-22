import React, { useState } from 'react';
import { Order, PlayerFractions, IngredientType, PlayerFractionInput } from '../types';
import { INGREDIENTS_CONFIG, INGREDIENT_ORDER } from '../constants';

interface Stage1Props {
  order: Order;
  onComplete: (fractions: PlayerFractions) => void;
}

const Customer: React.FC<{ order: Order }> = ({ order }) => {
    const orderText = INGREDIENT_ORDER.map(key => {
        const amount = order[key as IngredientType];
        return amount > 0 ? `${INGREDIENTS_CONFIG[key as IngredientType].name} ${amount}개` : '';
    }).filter(Boolean).join(', ');

    return (
        <div className="flex items-center space-x-4 mb-6 p-4 bg-sky-100 rounded-2xl border-2 border-sky-300 shadow-lg">
            <div className="text-6xl">👨‍🍳</div>
            <div className="relative bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg text-gray-800">
                    "햄버거 만들어주세요! <br/>{orderText} 넣어주세요!"
                </p>
                <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
            </div>
        </div>
    );
};

const IngredientAsset: React.FC<{ type: IngredientType }> = ({ type }) => {
    const styles: Record<string, string> = {
        egg: 'w-24 h-5 rounded-full shadow-inner border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-200 to-yellow-400',
        patty: 'w-28 h-6 rounded-md shadow-inner border-2 border-yellow-950/80 bg-gradient-to-br from-orange-900 to-yellow-950',
        cheese: 'w-28 h-2 rounded-sm shadow-sm bg-gradient-to-b from-yellow-400 to-yellow-500',
        cabbage: 'w-32 h-4 bg-gradient-to-b from-lime-300 to-green-400 opacity-90 rounded-[50%_50%_50%_50%_/_10%_10%_90%_90%]',
    };
    return <div className={`${styles[type]} shadow-md`}></div>;
};


const Stage1: React.FC<Stage1Props> = ({ order, onComplete }) => {
  const initialFractions = INGREDIENT_ORDER.reduce((acc, key) => {
    acc[key as IngredientType] = { numerator: '', denominator: '' };
    return acc;
  }, {} as PlayerFractions);

  const [fractions, setFractions] = useState<PlayerFractions>(initialFractions);
  const [feedback, setFeedback] = useState<string>('');

  const handleInputChange = (ingredient: IngredientType, part: 'numerator' | 'denominator', value: string) => {
    setFractions(prev => ({
      ...prev,
      [ingredient]: { ...prev[ingredient], [part]: value }
    }));
    setFeedback('');
  };

  const checkAnswer = () => {
    let allCorrect = true;
    for (const key of INGREDIENT_ORDER) {
      const type = key as IngredientType;
      const orderAmount = order[type];
      const totalAmount = INGREDIENTS_CONFIG[type].total;
      const playerInput = fractions[type];

      const num = parseInt(playerInput.numerator, 10);
      const den = parseInt(playerInput.denominator, 10);

      if (isNaN(num) || isNaN(den) || den === 0) {
        allCorrect = false;
        break;
      }

      if (num / den !== orderAmount / totalAmount) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setFeedback('주문 완료! 정확해요! 햄버거를 만들러 가요!');
      setTimeout(() => onComplete(fractions), 1500);
    } else {
      setFeedback('수량을 다시 확인해볼까? 🤔');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-amber-900 mb-2">1단계: 주문서를 작성해요!</h2>
      <p className="text-gray-600 mb-6">손님의 주문을 보고, 필요한 재료를 분수로 표현해보세요.</p>
      
      <div className="w-full grid md:grid-cols-2 gap-8">
        <div>
          <Customer order={order} />
          <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-md">
             <h3 className="text-xl font-bold text-yellow-800 mb-4">우리가 가진 재료</h3>
             <div className="grid grid-cols-2 gap-4">
               {INGREDIENT_ORDER.map(key => {
                   const type = key as IngredientType;
                   return (
                     <div key={type} className="flex flex-col items-center p-3 bg-white/60 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                        <IngredientAsset type={type} />
                        <p className="mt-2 font-semibold text-gray-700">{INGREDIENTS_CONFIG[type].name}</p>
                        <p className="text-sm text-gray-500">총 {INGREDIENTS_CONFIG[type].total}개</p>
                     </div>
                   )
               })}
             </div>
          </div>
        </div>
        
        <div className="p-4 bg-stone-50 rounded-xl shadow-lg border border-stone-200">
          <h3 className="text-2xl font-bold text-center text-gray-700 mb-4">주문서 📝</h3>
          <table className="w-full text-center">
            <thead>
              <tr className="border-b-4 border-stone-300 bg-stone-200/70">
                <th className="py-2">재료</th>
                <th className="py-2">전체 수량</th>
                <th className="py-2">주문 수량</th>
                <th className="py-2">분수</th>
              </tr>
            </thead>
            <tbody>
              {INGREDIENT_ORDER.map(key => {
                const type = key as IngredientType;
                return (
                  <tr key={type} className="border-b border-stone-200 hover:bg-stone-100 transition-colors duration-200">
                    <td className="py-4 font-semibold">{INGREDIENTS_CONFIG[type].name}</td>
                    <td>{INGREDIENTS_CONFIG[type].total}개</td>
                    <td className="font-bold text-blue-600">{order[type]}개</td>
                    <td className="py-2">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          className="w-16 text-center border-2 border-stone-300 rounded-lg shadow-inner text-lg font-bold bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
                          value={fractions[type].numerator}
                          onChange={(e) => handleInputChange(type, 'numerator', e.target.value)}
                          aria-label={`${INGREDIENTS_CONFIG[type].name} numerator`}
                        />
                        <div className="w-16 h-0.5 bg-gray-800 my-1"></div>
                        <input
                          type="number"
                          className="w-16 text-center border-2 border-stone-300 rounded-lg shadow-inner text-lg font-bold bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
                          value={fractions[type].denominator}
                          onChange={(e) => handleInputChange(type, 'denominator', e.target.value)}
                          aria-label={`${INGREDIENTS_CONFIG[type].name} denominator`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={checkAnswer}
          className="px-8 py-3 bg-gradient-to-br from-green-400 to-green-600 text-white text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform"
        >
          주문 확인
        </button>
        {feedback && (
          <p className={`mt-4 text-lg font-semibold p-3 rounded-lg ${feedback.includes('완료') ? 'text-green-800 bg-green-200/80' : 'text-red-800 bg-red-200/80'}`}>
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default Stage1;