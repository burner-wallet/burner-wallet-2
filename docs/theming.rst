*******
Theming
*******

The Burner Wallet (specifically the ModernUI package) has minimal support for themes, although we
plan allow further customization in the future.

Theme values can be passed to the optional ``theme`` prop of ModernUI:


.. code-block:: jsx
   const BurnerWallet = () => <ModernUI
    core={core}
    theme={{
      logo: '/static/mylogo.png',
      accentColor: '#4E3FCE',
    }}
  >

**Logo**

Passing the URL to an image will display that image as the logo in the wallet header.

**Accent Color**

The ``accentColor`` value will set the color for elements such as buttons.

The values ``accentLight`` and ``accentDark`` are automatically calculated based on ``accentColor``,
however you may override these values.

