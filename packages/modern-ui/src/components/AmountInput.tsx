import React from 'react';
import { AmountInputProps } from '@burner-wallet/types';

// interface AmountInputProps {
//   onChange: (val: string, isMax: boolean) => void;
//   asset?: Asset | null;
//   value: string;
//   disabled?: boolean;
//   max?: string | null;
// }

const AmountInput: React.FC<AmountInputProps> = ({ onChange, disabled, value, max/*, asset*/ }) => (
  <div>
    <input
      type="number"
      onChange={(e: any) => onChange(e.target.value, false)}
      disabled={disabled}
      value={value}
    />
    {max && (
      <button onClick={() => onChange(value, true)}>
        Max
      </button>
    )}
  </div>
);

export default AmountInput;
