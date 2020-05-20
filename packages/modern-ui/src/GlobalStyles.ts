import * as styledComponents from 'styled-components';
import { BurnerTheme } from './Template';
const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<BurnerTheme>;

const GlobalStyle = createGlobalStyle`
  :root {
    --l1-fs: 24px;
    --l1-lh: 1.5;
    --l1-weight: 600;

    --l2-fs: 18px;
    --l2-lh: 1.4;
    --l2-weight: 600;

    --l3-fs: 18px;
    --l3-lh: 1.4;
    --l3-weight: 400;

    --l4-fs: 16px;
    --l4-lh: 1.4;
    --l4-weight: 400;

    --l5-fs: 14px;
    --l5-lh: 1.4;
    --l5-weight: 400;

    --color-primary:  #1AAA9B;
    --color-secondary: #D2F9F5;
    --color-tertiary: #D2F9F5;

    --color-nearblack: #291a42;

    --color-disabled: #bbddd9;

    --modal-background: #E1DEFF;
    --modal-header-background: #CAC4FF;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body {
    background: ${props => props.theme.background};
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: ${props => props.theme.font};
    font-smoothing: antialiased;
  }

  html, body, #root {
    height: 100%;
  }

  /* disable iOS zooming on select */
  input, select { font-size: 100%; }
`;

export default GlobalStyle;
