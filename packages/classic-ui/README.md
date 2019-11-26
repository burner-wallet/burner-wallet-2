# @burner-wallet/classic-ui

This packages is included for legacy purposes. For most cases, you should use `@burner-wallet/modern-ui`.

# Burner Components

The following components are available to all plugins through the `burnerComponents` prop:

## Page

Container for a visual page component

**Props**

* `title` (string) The title of the page

**Example**
`
  <Page title="My Page">
    <div>Hello</div>
  </Page>
`

## AssetSelector

A drop down for selecting an asset

**Example**
`
  <Page title="My Page">
    <div>Hello</div>
  </Page>
`

## AccountBalance
Provides the balance of an account through a render prop

**Example**
`
  <Page title="My Page">
    <div>Hello</div>
  </Page>
`

## AccountKeys
Provides information about signing keys through a render prop

**Example**
`
  <Page title="My Page">
    <div>Hello</div>
  </Page>
`

## Assets
Provides an array of assets through a render prop

**Example**
`
  <Page title="My Page">
    <div>Hello</div>
  </Page>
`
## TransactionDetails
Provides details about a transaction through a render prop

**Example**
`
  <Page title="My Page">
    <div>Hello</div>
  </Page>
`

## QRCode
The QRCode component from the [qrcode.react](https://github.com/zpao/qrcode.react) package.

**Example**
`
  <QRCode value="0xa3798f0..." renderAs="svg" />
`

