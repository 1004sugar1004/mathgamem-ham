import React, { useState, useMemo } from 'react';
import { Order, PlayerFractions, IngredientType } from '../types';
import { INGREDIENTS_CONFIG, INGREDIENT_ORDER } from '../constants';

interface Stage2Props {
  order: Order;
  playerFractions: PlayerFractions;
  onComplete: () => void;
}

const IngredientAsset: React.FC<{ type: IngredientType | 'bun-top' | 'bun-bottom' }> = ({ type }) => {
    const styles: Record<string, string> = {
        egg: 'w-24 h-5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-100 to-yellow-300',
        patty: 'w-28 h-6 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border-2 border-orange-950/80 bg-gradient-to-br from-orange-800 to-orange-950',
        cheese: 'w-28 h-2 rounded-sm shadow-lg bg-gradient-to-b from-yellow-400 to-yellow-500 transform -rotate-3',
        cabbage: 'w-32 h-4 bg-gradient-to-b from-lime-300 to-green-400 opacity-90 rounded-[50%_50%_50%_50%_/_10%_10%_90%_90%] shadow-[inset_0_-3px_5px_rgba(0,0,0,0.1)]',
        'bun-top': 'w-32 h-12 bg-gradient-to-b from-amber-300 to-amber-500 rounded-t-full border-b-4 border-amber-600/30 shadow-[inset_0_5px_10px_rgba(255,255,255,0.5),_0_3px_5px_rgba(0,0,0,0.2)] flex items-center justify-center space-x-1',
        'bun-bottom': 'w-32 h-8 bg-gradient-to-t from-amber-400 to-amber-500 rounded-b-lg shadow-[inset_0_-5px_10px_rgba(0,0,0,0.15),_0_2px_3px_rgba(0,0,0,0.2)]',
    };
    if (type === 'bun-top') {
        return <div className={styles[type]}>
            <div className="w-2 h-2 bg-amber-100/90 rounded-full shadow-sm"></div>
            <div className="w-1.5 h-1.5 bg-amber-100/90 rounded-full shadow-sm"></div>
            <div className="w-2 h-2 bg-amber-100/90 rounded-full shadow-sm"></div>
        </div>
    }
    return <div className={`${styles[type]} drop-shadow-md`}></div>;
};

const CompletedHamburgerGraphic: React.FC = () => (
    <div className="relative w-64 h-64 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
             <div className="z-50"><IngredientAsset type="bun-top" /></div>
            <div className="mt-[-25px] z-40"><IngredientAsset type="cabbage" /></div>
            <div className="mt-[-10px] z-30"><IngredientAsset type="cheese" /></div>
            <div className="mt-[-5px] z-20"><IngredientAsset type="egg" /></div>
            <div className="mt-[-10px] z-10"><IngredientAsset type="patty" /></div>
            <div className="mt-[-5px] z-0"><IngredientAsset type="bun-bottom" /></div>
        </div>
    </div>
);

const CompletedHamburgerView: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-10 animate-pop-in">
        <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600 mb-6 drop-shadow-lg">맛있는 햄버거 완성!</h3>
        <div className="transition-transform duration-500 transform hover:scale-110 hover:rotate-3">
             <CompletedHamburgerGraphic />
        </div>
    </div>
);


const Stage2: React.FC<Stage2Props> = ({ order, playerFractions, onComplete }) => {
  const [stack, setStack] = useState<(IngredientType | 'bun-top')[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isBurgerComplete, setIsBurgerComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const correctStackOrder = useMemo(() => {
    return INGREDIENT_ORDER.flatMap(type => Array(order[type]).fill(type));
  }, [order]);
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('ingredientType') as IngredientType | 'bun-top';
    if(type) {
        setStack(prev => [...prev, type]);
        setFeedback('');
    }
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const checkHamburger = () => {
    const playerStack = stack.filter(item => item !== 'bun-top');
    
    if (stack.length > 0 && stack[stack.length - 1] !== 'bun-top') {
        setFeedback('빵을 덮어주세요! 🍔');
        return;
    }
    
    const playerCounts = playerStack.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {} as Record<IngredientType, number>);

    const orderCounts = correctStackOrder.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {} as Record<IngredientType, number>);

    if (JSON.stringify(playerCounts) !== JSON.stringify(orderCounts)) {
        setFeedback('어? 주문서와 재료 개수가 다른 것 같아요!');
        return;
    }

    if(JSON.stringify(playerStack) !== JSON.stringify(correctStackOrder)) {
        setFeedback('재료를 쌓는 순서가 다른 것 같아요! 주문서를 확인해보세요.');
        return;
    }

    setFeedback('맛있는 햄버거 완성! 🥳');
    setIsBurgerComplete(true);
    setTimeout(onComplete, 2500);
  };
  
  const resetStack = () => {
      setStack([]);
      setFeedback('');
  }

  const removeLastIngredient = () => {
      setStack(prev => prev.slice(0, -1));
      setFeedback('');
  };

  const draggableIngredients: (IngredientType | 'bun-top')[] = [...INGREDIENT_ORDER, 'bun-top'];
  
  const playerIngredientStack = stack.filter(item => item !== 'bun-top');
  const nextIngredientIndex = playerIngredientStack.length;
  let guidanceText = '';
  if (nextIngredientIndex < correctStackOrder.length) {
      const nextIngredientType = correctStackOrder[nextIngredientIndex];
      guidanceText = `다음 재료: ${INGREDIENTS_CONFIG[nextIngredientType].name}`;
  } else if (correctStackOrder.length > 0) { 
      guidanceText = '윗면 빵을 올려주세요! 🍔';
  }

  const getMarginForStackItem = (type: IngredientType | 'bun-top'): string => {
    // Goal: leave a visible part of the item below. Let's aim for ~8px (0.5rem).
    // Heights: egg:h-5(20px), patty:h-6(24px), cabbage:h-4(16px), cheese:h-2(8px), bun-top:h-12(48px)
    switch (type) {
        case 'egg': return '-mt-3';     // 20px height -> pull up 12px. 8px visible.
        case 'patty': return '-mt-4';   // 24px height -> pull up 16px. 8px visible.
        case 'cabbage': return '-mt-2'; // 16px height -> pull up 8px. 8px visible.
        case 'cheese': return 'mt-0';   // 8px height -> pull up 0px. 8px visible.
        case 'bun-top': return '-mt-10';// 48px height -> pull up 40px. 8px visible.
        default: return '-mt-3';
    }
  };

  const stackWithCounts = useMemo(() => {
    return stack.map((item, index) => {
        let count = 1;
        let isLastInSequence = true;
        
        if (index + 1 < stack.length && stack[index + 1] === item) {
            isLastInSequence = false;
        }
        
        if (isLastInSequence) {
            let i = index - 1;
            while (i >= 0 && stack[i] === item) {
                count++;
                i--;
            }
        }
        return { item, count, showCount: isLastInSequence && count > 1 };
    });
  }, [stack]);


  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-amber-800 mb-2">2단계: 햄버거를 만들어요!</h2>
      <p className="text-gray-600 mb-6">주문서를 보고 달걀부침부터 순서대로 재료를 쌓아주세요.</p>
      
      {isBurgerComplete ? (
        <CompletedHamburgerView />
      ) : (
      <div className="w-full grid md:grid-cols-3 gap-6">
        <div className="p-4 bg-stone-50 rounded-xl shadow-lg border border-stone-200 h-fit">
            <h3 className="text-xl font-bold text-center text-gray-700 mb-4">완성된 주문서 📝</h3>
             <table className="w-full text-center">
                <thead>
                  <tr className="border-b-4 border-stone-300 bg-stone-200/70">
                    <th className="py-2 text-sm font-semibold text-gray-600">재료</th>
                    <th className="py-2 text-sm font-semibold text-gray-600">전체 수량</th>
                    <th className="py-2 text-sm font-semibold text-gray-600">주문량</th>
                    <th className="py-2 text-sm font-semibold text-gray-600">분수 표현</th>
                  </tr>
                </thead>
                <tbody>
                {INGREDIENT_ORDER.map(key => (
                    <tr key={key} className="border-b border-gray-200 last:border-b-0">
                        <td className="py-3 font-semibold">{INGREDIENTS_CONFIG[key].name}</td>
                        <td className="py-3 text-lg">
                           <span className="text-gray-600">{INGREDIENTS_CONFIG[key].total}개</span>
                        </td>
                        <td className="py-3 text-2xl font-bold text-blue-600">?</td>
                        <td className="py-3">
                           <div className="flex flex-col items-center justify-center leading-none text-gray-800">
                              <span className="text-lg font-bold">{playerFractions[key].numerator}</span>
                              <div className="w-8 h-0.5 bg-gray-800 my-0.5"></div>
                              <span className="text-lg font-bold">{playerFractions[key].denominator}</span>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
             </table>
        </div>
        
        <div className="flex flex-col items-center">
            {guidanceText && <p className="text-center text-xl font-bold text-blue-600 mb-2 h-8 animate-pulse">{guidanceText}</p>}
            <div 
                className={`w-full flex flex-col-reverse items-center p-4 bg-sky-100/50 rounded-2xl border-dashed border-4 min-h-[400px] relative transition-all duration-300 ${isDragging ? 'border-green-400 bg-green-100/70 scale-105 ring-4 ring-offset-2 ring-green-400 animate-pulse' : 'border-sky-400'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <div style={{ zIndex: 0 }}>
                    <IngredientAsset type="bun-bottom" />
                </div>
                
                {stackWithCounts.map(({ item, count, showCount }, index) => (
                    <div key={`${item}-${index}`} className={`relative ${getMarginForStackItem(item)}`} style={{ zIndex: index + 1 }}>
                        <IngredientAsset type={item} />
                        {showCount && (
                            <div className="absolute -right-7 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pop-in">
                                x{count}
                            </div>
                        )}
                    </div>
                ))}

                {stack.length === 0 && <p className="text-gray-500 absolute inset-0 flex items-center justify-center">이곳에 재료를 쌓아주세요</p>}
            </div>
        </div>

        <div className="p-6 bg-gradient-to-b from-yellow-50 to-orange-100 rounded-xl shadow-lg border-2 border-yellow-200 flex flex-col items-center space-y-4">
            <h3 className="text-xl font-bold text-yellow-800">재료</h3>
            {draggableIngredients.map(type => (
                 <div
                    key={type}
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData('ingredientType', type);
                        setIsDragging(true);
                    }}
                    onDragEnd={() => setIsDragging(false)}
                    className="cursor-grab bg-white/70 p-4 rounded-xl shadow-md transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-lg active:cursor-grabbing active:shadow-xl flex flex-col items-center w-full"
                >
                    <IngredientAsset type={type} />
                    <p className="text-center text-sm font-semibold text-gray-700 mt-1">{type.includes('bun') ? '빵' : INGREDIENTS_CONFIG[type].name}</p>
                </div>
            ))}
        </div>
      </div>
      )}
      
       {!isBurgerComplete && (
       <div className="mt-8 text-center">
        <button
          onClick={checkHamburger}
          className="px-8 py-3 bg-green-500 text-white text-xl font-bold rounded-full shadow-lg border-b-8 border-green-700 transform transition-all duration-150 hover:-translate-y-1 active:translate-y-0.5 active:border-b-4 active:bg-green-600 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
          disabled={stack.length === 0}
        >
          햄버거 완성!
        </button>
        <button
          onClick={removeLastIngredient}
          className="ml-4 px-6 py-2 bg-orange-500 text-white text-lg font-bold rounded-full shadow-lg border-b-8 border-orange-700 transform transition-all duration-150 hover:-translate-y-1 active:translate-y-0.5 active:border-b-4 active:bg-orange-600 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
          disabled={stack.length === 0}
        >
          재료 빼기
        </button>
        <button
          onClick={resetStack}
          className="ml-4 px-6 py-2 bg-red-500 text-white text-lg font-bold rounded-full shadow-lg border-b-8 border-red-700 transform transition-all duration-150 hover:-translate-y-1 active:translate-y-0.5 active:border-b-4 active:bg-red-600"
        >
          다시 쌓기
        </button>
        {feedback && (
          <p className={`mt-4 text-lg font-semibold p-3 rounded-lg animate-pop-in ${feedback.includes('완성') ? 'text-green-800 bg-green-200/80' : 'text-red-800 bg-red-200/80'}`}>
            {feedback}
          </p>
        )}
      </div>
      )}
    </div>
  );
};

export default Stage2;