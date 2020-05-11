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
  background: ${props => props.theme.background};
`;

const InnerContainer = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const Slides = styled.div`
  flex: 5;
  position: relative;

  & .react-swipeable-view-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Bottom = styled.div`
  flex: 1;
  display: flex;
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
  background: ${props => props.active ? '#8e8e8e' : '#cacaca'};
  display: inline-block;
  margin: 0 8px;
`;

const Col = styled.div<{ width?: number }>`
  flex: ${props => props.width || 1};
  display: flex;
  justify-content: center;
  align-items: center;
`;


const OnboardingPage: React.FC<PluginPageContext<{}, OnboardingPlugin>> = ({ plugin, BurnerComponents, actions }) => {
  const [pageNum, setPage] = useState(0);

  const complete = () => {
    plugin.complete();
    actions.navigateTo('/');
  };

  const { Button } = BurnerComponents;
  return (
    <Container>
      <InnerContainer>
        <Slides>
          <SwipeableViews onChangeIndex={(index: number) => setPage(index)} index={pageNum}>
            {plugin.slides.map((page: any, index: number) => (
              <PageWrapper key={index}>{page}</PageWrapper>
            ))}
          </SwipeableViews>

          <Dots>
            {plugin.slides.map((page: any, index: number) => (
              <Dot key={index} active={index === pageNum} />
            ))}
          </Dots>
        </Slides>
        

        <Bottom>
          {plugin.showArrowButtons && (
            <Col>
              {pageNum > 0 && (
                <Button onClick={() => setPage(pageNum - 1)}>Back</Button>
              )}
            </Col>
          )}

          <Col width={2}>
            {(plugin.alwaysShowSkip || pageNum === plugin.slides.length - 1) && (
              <Button onClick={complete}>Get Started</Button>
            )}
          </Col>

          {plugin.showArrowButtons && (
            <Col>
              {pageNum < plugin.slides.length - 1 && (
                <Button onClick={() => setPage(pageNum + 1)}>Next</Button>
              )}
            </Col>
          )}
        </Bottom>
      </InnerContainer>
    </Container>
  );
};

export default OnboardingPage;
