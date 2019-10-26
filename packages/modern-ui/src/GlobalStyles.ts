import { createGlobalStyle } from 'styled-components';

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

    --main-font: system-ui, "-apple-system", BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

    --page-margin: 16px;

    --color-primary:  #1AAA9B;
    --color-secondary: #D2F9F5;
    --color-tertiary: #D2F9F5;
    --color-makergradient: linear-gradient(180deg, rgba(182, 237, 231, 0.38) 0%, rgba(253, 193, 52, 0.15) 100%);
    --color-makergradientdarker: linear-gradient(180deg, rgba(16, 230, 206, 0.38) 15.63%, rgba(255, 187, 28, 0.25) 100%);
    --color-makerheadline: #291a42;

    --color-nearblack: #291a42;

    --color-disabled: #bbddd9;

    --modal-background: #E1DEFF;
    --modal-header-background: #CAC4FF;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body {
    background: #ededed;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: var(--main-font);
    font-smoothing: antialiased;
  }

  html, body, #root {
    height: 100%;
  }

  /* disable iOS zooming on select */
  input, select { font-size: 100%; }
`;

export default GlobalStyle;
