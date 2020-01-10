import React from 'react';
import { DataProviders } from '@burner-wallet/ui-core';
import styled from 'styled-components';

const AddressSegment = styled.span<{ hidden?: boolean }>`
  display: inline-block;
  overflow: hidden;
  font-family: monospace;

  ${props => props.hidden && `
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 6em;
  `}
`;

interface AddressProps {
  address: string;
}

const Address: React.FC<AddressProps> = ({ address }) => {
  return (
    <DataProviders.AddressName
      address={address}
      render={(name: string | null) => name ? (
        <span>{name}</span>
      ) : (
        <span>
          <AddressSegment hidden>{address.substr(0, 34)}</AddressSegment>
          <AddressSegment>{address.substr(-8)}</AddressSegment>
        </span>
      )}
    />
  );
};

export default Address;