import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Actions } from '@burner-wallet/types';
import Button from '../../components/Button';

const SCAN_QR_DATAURI = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H0V2A2,2 0 0,1 2,0H6V2H2M22,0A2,2 0 0,1 24,2V6H22V2H18V0H22M2,18V22H6V24H2A2,2 0 0,1 0,22V18H2M22,22V18H24V22A2,2 0 0,1 22,24H18V22H22Z' /%3E%3C/svg%3E`;

const ScanButton = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 72px;
  width: 72px;
  border-radius: 50%;
  border: none;
  order: 3;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
  outline: none;

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    background: center no-repeat url("${SCAN_QR_DATAURI}");
    background-size: 50%;
    z-index:21;
  }
  &:before {
    background: var(--color-makergradientdarker);
  }
`;

const BottomButton = styled(Link)`
  display: flex;
  color: var(--color-primary);
  font-size: 18px;
  z-index: 10;
  text-decoration: none;
  height: 48px;
  align-items: center;
  flex: 1;
  justify-content: center;

  &:hover {
    background: #edfcfb;
  }
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  margin: 0 16px;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 16px;
  border: solid 1px rgb(238, 238, 238);
  border-radius: 8px;
`;


const BottomActions: React.FC<{ actions: Actions }> = ({ actions }) => {
  return (
    <Bar>
      <BottomButton to="/request">Request</BottomButton>
      <ScanButton onClick={actions.openDefaultQRScanner} />
      <BottomButton to="/send">Send</BottomButton>
    </Bar>
  );
}

export default BottomActions;
