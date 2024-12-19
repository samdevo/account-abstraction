## Steps to reproduce:

1. `yarn install`

*Note: To resolve some dependency issues, I had to change the `ts-mocha` version to `^9.0.0`.*

2. Set the following environment variables (or create a `.env` file in the root directory, which is what I did):

```
INFURA_ID=<infura project id>
MNEMONIC_FILE=./mnemonic.txt
```

3. Create a `mnemonic.txt` file in the root directory with your mnemonic phrase, corresponding to a wallet with some Sepolia ETH.

4. `yarn deploy --network sepolia --simple-account-factory`









