import React, { Fragment, useEffect, useState } from 'react';
import { AddressNameProps } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';

const AddressName: React.FC<AddressNameProps & BurnerContext> = ({ address, render, pluginData }) => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    pluginData.getAddressName(address).then((name: string | null) => setName(name));
  }, [address]);

  return (
    <Fragment>
      {render(name, address)}
    </Fragment>
  );
}

export default withBurner(AddressName);
