import React, { useState } from 'react';
import { isValidMnemonic, fromMnemonic } from 'ethers/utils/hdnode';

const SeedPhraseInput = ({ burnerComponents, actions, accounts }) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const { Button } = burnerComponents;

  const locked = accounts.length === 0 || !actions.canCallSigner('writeKey', accounts[0]);

  let privateKey = null;
  const isValid = isValidMnemonic(seedPhrase);
  if (isValid) {
    const node = fromMnemonic(seedPhrase);
    ({ privateKey } = node.derivePath("m/44'/60'/0'/0/0"));
  }

  return (
    <div>
      <h3>Seed Phrase</h3>
      <input
        value={seedPhrase}
        onChange={e => setSeedPhrase(e.target.value)}
        style={{ width: '100%' }}
      />
      <Button
        disabled={!isValid}
        onClick={() => {
          if(isValid) {
            actions.callSigner('writeKey', accounts[0], privateKey);
            setSeedPhrase('');
          }
        }}
      >
        Load address
      </Button> 
    </div>
  );
};

export default SeedPhraseInput;
