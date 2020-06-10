#!/usr/bin/env node

import yargs from 'yargs';
import startLocalWallet from './local-burner';

yargs
  .command({
    command: 'start',
    aliases: ['*', 'local-wallet'],
    describe: 'Run a Burner Wallet connected to local node',
    builder: {
      command: {
        alias: 'c',
        default: 'yarn start-wallet',
        describe: 'command to execute to start the wallet server',
      },
      rpc: {
        alias: 'r',
        default: 'http://localhost:8545',
        describe: 'RPC URL for Ganache or other node',
      },
    },
    handler: (argv) => {
      startLocalWallet({
        command: argv.command as string,
        rpc: argv.rpc as string,
      });
    }
  })
  .help()
  .argv;

process.on('unhandledRejection', e => console.error(e));
