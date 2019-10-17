declare module 'eth-ens-namehash' {
  interface Namehash {
    hash: (name: string) => string;
  }

  const _default: Namehash;
  export default _default;
}
