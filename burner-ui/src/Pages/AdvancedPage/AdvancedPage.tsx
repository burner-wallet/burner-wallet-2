import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';
import AccountKeys from '../../data-providers/AccountKeys';

const Section = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    {children}
  </div>
)

const AdvancedPage = ({ accounts }: BurnerContext) => {
  const [showPk, setShowPk] = React.useState(false);
  return (
    <Page title="Advanced">
      <AccountKeys
        account={accounts[0]}
        render={keys => keys && (
          <Section title="Private Key">
            <div>
              <button type="button" onClick={() => setShowPk(!showPk)}>
                {showPk ? 'Hide' : 'Show'} PK
              </button>
              <button type="button" onClick={() => navigator.clipboard.writeText(keys.privateKey)}>
                Copy PK
              </button>
            </div>

            {showPk && (
              <div>
                <div><QRCode value={keys.privateKey} renderAs="svg" /></div>
                <div><input value={keys.privateKey} readOnly /></div>
              </div>
            )}

            <div>
              <button type="button" onClick={keys.burnAccount}>Burn PK</button>
            </div>
          </Section>
        )}
      />
    </Page>
  );
};

export default AdvancedPage;
