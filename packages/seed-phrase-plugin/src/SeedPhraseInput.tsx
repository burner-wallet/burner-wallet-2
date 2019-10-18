import React, { useState } from 'react';
import { isValidMnemonic, fromMnemonic } from 'ethers/utils/hdnode';
import { PluginElementContext } from '@burner-wallet/ui-core';

const SeedPhraseInput: React.FC<PluginElementContext> = ({ burnerComponents, actions, defaultAccount }) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const { Button } = burnerComponents;

  const locked = !actions.canCallSigner('writeKey', defaultAccount);

  let privateKey: string | null = null;
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
          if(privateKey && isValid) {
            actions.safeSetPK(privateKey);
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
