import React, { useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import OnboardingPlugin from '../OnboardingPlugin';
import SwipeableViews from 'react-swipeable-views';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ededed;
`;

const InnerContainer = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const Pages = styled.div`
  flex: 5;
  position: relative;
`;

const PageWrapper = styled.div`
  flex: 1;
`;

const Bottom = styled.div`
  flex: 1;
  border-top: solid 1px #dddddd;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
`;

const Dot = styled.div<{ active: boolean }>`
  height: 14px;
  width: 14px;
  border-radius: 14px;
  background: ${props => props.active ? 'blue' : 'red'};
  display: inline-block;
  margin: 0 8px;
`;

const pages = [
  (<div>Page 1</div>),
  (<div>Page 2</div>),
];

const OnboardingPage: React.FC<PluginPageContext<{}, OnboardingPlugin>> = ({ plugin }) => {
  const [pageNum, setPage] = useState(0);

  return (
    <Container>
      <InnerContainer>
        <Pages>
          <SwipeableViews onChangeIndex={(index: number) => setPage(index)} index={pageNum}>
            {pages.map((page: any, index: number) => (
              <PageWrapper key={index}>{page}</PageWrapper>
            ))}
          </SwipeableViews>

          <Dots>
            {pages.map((page: any, index: number) => (
              <Dot key={index} active={index === pageNum} />
            ))}
          </Dots>
        </Pages>
        

        <Bottom>
          <button onClick={() => setPage(pageNum - 1)}>prev</button>
          <button onClick={plugin.complete}>complete</button>
          <button onClick={() => setPage(pageNum + 1)}>next</button>
        </Bottom>
      </InnerContainer>
    </Container>
  );
};

export default OnboardingPage;
