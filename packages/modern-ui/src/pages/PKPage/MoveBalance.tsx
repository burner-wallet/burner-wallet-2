import React, { useState } from 'react';
import { Asset } from '@burner-wallet/types';
import { isAllZero } from '../../lib';
import Button from '../../components/Button';
import Balances from './Balances';

interface MoveBalanceProps {
  assets: Asset[];
  currentAddress: string;
  newAddress: string;
  currentBalances: string[];
  newBalances: string[];
  onMoveToCurrent: () => Promise<void>;
  onMoveToNew: () => Promise<void>;
  discardOld: () => Promise<void>;
  cancel: () => void;
}

const MoveBalance: React.FC<MoveBalanceProps> = ({
  assets, currentAddress, newAddress, currentBalances, newBalances, onMoveToCurrent,
  onMoveToNew, discardOld, cancel
}) => {
  const [pending, setPending] = useState(false);
  const newEmpty = isAllZero(newBalances);

  const runAndWait = (func: () => Promise<void>) => async () => {
    setPending(true);
    await func();
    setPending(false);
  }

  return (
    <div>
      <div>
        <div>New Account</div>
        <div>{newAddress}</div>
        <Balances assets={assets} balances={newBalances} />
      </div>

      <div>
        <div>Existing Account</div>
        <div>{currentAddress}</div>
        <Balances assets={assets} balances={currentBalances} />
      </div>

      <div>
        <Button onClick={cancel} disabled={pending}>
          Cancel
        </Button>
        <Button onClick={runAndWait(onMoveToNew)} disabled={pending}>
          Move funds to new account ({newAddress.substr(0, 8)})
        </Button>
        {newEmpty ? null : (
          <Button onClick={runAndWait(onMoveToCurrent)} disabled={pending}>
            Move funds to existing account ({currentAddress.substr(0, 8)})
          </Button>
        )}
        <Button onClick={runAndWait(discardOld)} disabled={pending}>
          Discard funds and switch accounts ({newAddress.substr(0, 8)})
        </Button>
      </div>
    </div>
  );
};

export default MoveBalance;
