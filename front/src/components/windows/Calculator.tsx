import { useState, useCallback } from 'react';

type Operator = '+' | '-' | '*' | '/';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const calculate = useCallback((left: number, right: number, op: Operator): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : 0;
    }
  }, []);

  const handleOperator = useCallback((nextOp: Operator) => {
    const current = parseFloat(display);

    if (previousValue !== null && operator && !waitingForOperand) {
      const result = calculate(previousValue, current, operator);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }

    setOperator(nextOp);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, waitingForOperand, calculate]);

  const handleEquals = useCallback(() => {
    if (previousValue === null || !operator) return;

    const current = parseFloat(display);
    const result = calculate(previousValue, current, operator);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, calculate]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
    setWaitingForOperand(false);
  }, []);

  const backspace = useCallback(() => {
    if (waitingForOperand) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  }, [display, waitingForOperand]);

  const percent = useCallback(() => {
    const value = parseFloat(display);
    if (previousValue !== null) {
      setDisplay(String(previousValue * value / 100));
    } else {
      setDisplay(String(value / 100));
    }
  }, [display, previousValue]);

  const sqrt = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(value >= 0 ? String(Math.sqrt(value)) : 'Erreur');
  }, [display]);

  const inverse = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(value !== 0 ? String(1 / value) : 'Erreur');
  }, [display]);

  const memClear = useCallback(() => setMemory(0), []);
  const memRecall = useCallback(() => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  }, [memory]);
  const memStore = useCallback(() => setMemory(parseFloat(display)), [display]);
  const memAdd = useCallback(() => setMemory(memory + parseFloat(display)), [display, memory]);

  const formatDisplay = (value: string): string => {
    if (value === 'Erreur') return value;
    const num = parseFloat(value);
    if (isNaN(num)) return 'Erreur';
    if (value.endsWith('.')) return value;
    if (value.includes('.') && value.endsWith('0') && !waitingForOperand) return value;
    if (Number.isInteger(num) && !value.includes('.')) {
      return num.toLocaleString('fr-FR');
    }
    return value;
  };

  return (
    <div className="calc">
      <div className="calc-display">
        <div className="calc-display-text">{formatDisplay(display)}</div>
      </div>
      <div className="calc-buttons">
        {/* Row 1: Memory + Backspace/CE/C */}
        <button className="calc-btn calc-btn-mem" onClick={memClear}>MC</button>
        <button className="calc-btn calc-btn-red calc-btn-wide" onClick={backspace}>Retour</button>
        <button className="calc-btn calc-btn-red" onClick={clearEntry}>CE</button>
        <button className="calc-btn calc-btn-red" onClick={clearAll}>C</button>

        {/* Row 2: MR + 7 8 9 / sqrt */}
        <button className="calc-btn calc-btn-mem" onClick={memRecall}>MR</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('7')}>7</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('8')}>8</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('9')}>9</button>
        <button className="calc-btn calc-btn-op" onClick={() => handleOperator('/')}>/</button>
        <button className="calc-btn calc-btn-fn" onClick={sqrt}>sqrt</button>

        {/* Row 3: MS + 4 5 6 * % */}
        <button className="calc-btn calc-btn-mem" onClick={memStore}>MS</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('4')}>4</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('5')}>5</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('6')}>6</button>
        <button className="calc-btn calc-btn-op" onClick={() => handleOperator('*')}>*</button>
        <button className="calc-btn calc-btn-fn" onClick={percent}>%</button>

        {/* Row 4: M+ + 1 2 3 - 1/x */}
        <button className="calc-btn calc-btn-mem" onClick={memAdd}>M+</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('1')}>1</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('2')}>2</button>
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('3')}>3</button>
        <button className="calc-btn calc-btn-op" onClick={() => handleOperator('-')}>-</button>
        <button className="calc-btn calc-btn-fn" onClick={inverse}>1/x</button>

        {/* Row 5: (empty) + 0 +/- . + = */}
        <div className="calc-btn-spacer" />
        <button className="calc-btn calc-btn-num" onClick={() => inputDigit('0')}>0</button>
        <button className="calc-btn calc-btn-num" onClick={toggleSign}>+/-</button>
        <button className="calc-btn calc-btn-num" onClick={inputDot}>,</button>
        <button className="calc-btn calc-btn-op" onClick={() => handleOperator('+')}>+</button>
        <button className="calc-btn calc-btn-eq" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}
