const { spawn } = require('child_process');
const Web3 = require('web3');
const { testRPC } = require('./run-local-lib');

const RPC = 'http://localhost:8545';
const PK_USER = '0xecb2222da7cbca080201acf6a7bbda53a3b2bcb22e3004b83ab8c69a884becb9';

(async function() {
  if (!await testRPC(RPC)) {
    throw new Error('Ganache not found on port 8545');
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(RPC), null, {
    transactionConfirmationBlocks: 1,
  });

  const user = web3.eth.accounts.privateKeyToAccount(PK_USER);

  const balance = await web3.eth.getBalance(user.address);
  console.log(balance, 'bal');
  if (balance === '0') {
    const [defaultAccount] = await web3.eth.getAccounts();
    if (!defaultAccount) {
      throw new Error('Can not find an unlocked account');
    }

    console.log(`Sending 1 ETH from ${defaultAccount} to ${user.address}`);
    await web3.eth.sendTransaction({
      from: defaultAccount,
      to: user.address,
      value: web3.utils.toWei('1', 'ether'),
    });
  }


  spawn('yarn', ['start-wallet'], {
    env: {
      ...process.env,
      REACT_APP_PK: PK_USER,
    },
    stdio: 'inherit',
  });
})();

