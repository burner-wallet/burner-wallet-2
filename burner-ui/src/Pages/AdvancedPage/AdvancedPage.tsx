import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Button from '../../components/Button';
import Page from '../../components/Page';
import PluginElements from '../../components/PluginElements';
import AccountKeys from '../../data-providers/AccountKeys';

interface SectionProps {
  title: string,
  children:  React.ReactNode,
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    {children}
  </div>
)

const AdvancedPage: React.FC<BurnerContext> = ({ defaultAccount }) => {
  const [showPk, setShowPk] = React.useState(false);
  return (
    <Page title="Advanced">
      <AccountKeys
        account={defaultAccount}
        render={keys => keys && (
          <Section title="Private Key">
            <div style={{ display: 'flex' }}>
              <Button onClick={() => setShowPk(!showPk)}>
                {showPk ? 'Hide' : 'Show'} PK
              </Button>
              <Button onClick={() => navigator.clipboard.writeText(keys.privateKey)}>
                Copy PK
              </Button>
            </div>

            {showPk && (
              <div>
                <div><QRCode value={keys.privateKey} renderAs="svg" /></div>
                <div><input value={keys.privateKey} readOnly /></div>
              </div>
            )}

            <div>
              <Button onClick={keys.burnAccount}>Burn PK</Button>
            </div>
          </Section>
        )}
      />

      <PluginElements position="advanced" />
    </Page>
  );
};

export default withBurner(AdvancedPage);
