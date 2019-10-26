import React, { useRef, useState, Fragment } from 'react';
import QrReader from 'react-qr-reader';
import { withBurner, BurnerContext } from '@burner-wallet/ui-core';
import styled from 'styled-components';
import Button from './Button';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(139, 139, 144, 0.7);
  z-index: 100;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  color: rgb(0, 14, 26);
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 16px;
  flex: 1;
  border-radius: 8px;
  padding: 16px;
`

const Header = styled.h1`
  font-size: var(--l1-fs);
  line-height: var(--l1-lh);
  font-weight: var(--l1-weight);
  margin: 0;
`;

const TextInstruction = styled.p`
  font-size: var(--l3-fs);
  line-height: var(--l3-lh);
  font-weight: var(--l3-weight);
  text-align: left;
  margin: 0px;
`;

const CameraIconContainer = styled.div`
  display: flex;
  height: 100px;
`;

const CameraIcon = styled.svg`
  flex: 1;
`;

const ReaderOuterContainer = styled.div`
  position: relative;
  flex: 1;
`;

const ReaderInnerContainer = styled.div`
  padding-top: 100%;
  max-height: 100%;
  max-width: 100%;
  position: relative;
`;

const Reader = styled(QrReader)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const CloseContainer = styled.div`margin-top: 20px;`;

const CloseButton = styled(Button)`
  width: 100%;
`;

const Scanner: React.FC<BurnerContext> = ({ completeScan }) => {
  const reader = useRef<any>(null);
  const [fallback, setFallback] = useState(false);

  if (!completeScan) {
    return null;
  }

  return (
    <Overlay>
      <Container>
        <Header>Scan</Header>

        <TextInstruction>
          {fallback ? 'Upload a photo of a QR code' : 'Place the QR code within the scanner'}
        </TextInstruction>

        {fallback && (
          <CameraIconContainer onClick={() => reader.current!.openImageDialog()}>
            <CameraIcon viewBox="0 0 24 24">
              <path
                fill="#ffffff"
                d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
              />
            </CameraIcon>
          </CameraIconContainer>
        )}

        <ReaderOuterContainer>
          <ReaderInnerContainer>
            <Reader
              delay={300}
              ref={reader}
              legacyMode={fallback}
              onError={err => {
                console.error(err);
                setFallback(true);
              }}
              onScan={address => {
                if (address) {
                  completeScan(address);
                }
              }}
            />
          </ReaderInnerContainer>
        </ReaderOuterContainer>
      </Container>

      <CloseContainer>
        <CloseButton onClick={() => completeScan(null)}>
          Close
        </CloseButton>
      </CloseContainer>
    </Overlay>
  );
};

export default withBurner(Scanner);
