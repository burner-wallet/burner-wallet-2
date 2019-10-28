import React, { ComponentType, Fragment, MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Popup from './Popup';

const DropdownContainer = styled.div<{ open?: boolean }>`
  background: #e1deff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 8px;
  height: 40px;
  cursor: default;

  &:hover {
    background: #d1ccfc;
  }

  &:after {
    content: '\\25be';
    margin: 4px;
    color: #555;
    display: block;
  }

  ${props => props.open && `
    background: #d1ccfc;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}
`;

const DropdownPopup = styled.div`
  background: #e1deff;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
`;

const ItemContainer = styled.div`
  padding: 8px;
  cursor: default;
  &:hover {
    background: #d1ccfc;
  }
`;

export interface ItemComponentProps<T> {
  item: T;
}

interface DropdownProps<T> {
  options: T[];
  selected: T | null;
  onChange: (newSelection: T) => void;
  itemComponent: ComponentType<ItemComponentProps<T>>;
  disabled?: boolean;
}

type DropdownType = <T = string>(props: DropdownProps<T>) => ReactElement<DropdownProps<T>>;

const Dropdown: DropdownType = ({ options, selected, onChange, disabled, itemComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchor = useRef<HTMLDivElement | null>(null);
  const ItemComponent = itemComponent;

  useEffect(() => {
    if (isOpen) {
      const clickListener = () => setIsOpen(false);
      document.addEventListener('click', clickListener);
      return () => document.removeEventListener('click', clickListener);
    }
  }, [isOpen]);

  return (
    <Fragment>
      <DropdownContainer
        ref={anchor}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        open={isOpen}
      >
        {selected && (
          <ItemComponent item={selected} />
        )}
      </DropdownContainer>

      {isOpen && !disabled && (
        <Popup anchor={anchor.current}>
          <DropdownPopup>
            {options.map((option, i) => (
              // @ts-ignore
              <ItemContainer key={i} onClick={() => onChange(option)}>
                <ItemComponent item={option} />
              </ItemContainer>
            ))}
          </DropdownPopup>
        </Popup>
      )}
    </Fragment>
  );
};

export default Dropdown;
