# Ball Street Daohack PoC

Project submission for:
https://www.encode.club/hack

## Blockchain
All blockchain related code can be found under "/app"

### Tech
- Hardhat: for testing smart contracts
- TypeScript: for writing tests
- OpenZeppelin: for contract templates

### Contracts
**GovernerContract**:
Inherits from OpenZeppelin and modified to accept proposals and votes.

**TimeLock**:
Inherits from OpenZeppelin and modified to execute proposal after a fixed time if enough votes are submitted.
TimeLock is sole owner of DAO

**GovernanceToken**:
ERC20 token giving voting power

**DAO**:
Smart contract representing DAO

### Demo
In the /app folder, the following commands can be run to test out governance
```bash
yarn start # DEPLOY CONTRACTS LOCALLY
yarn propose # RUN SUBMIT PROPOSAL SCRIPT
yarn vote # RUN SUBMIT VOTE ON PROPOSAL SCRIPT
yarn execute # RUN PROPOSAL EXECUTE SCRIPT
yarn mine # MINE SOME BLOCKS TO SKIP TIME FOR DEVELOPMENT PURPOSES
```


## Front-end
All frontend related code can be found under "/quasar"

### Tech
- Vue3: chosen framework
- Quasar: for pre-built components
- Ethers: for connecting to chain

### Demo
In the /quasar folder, the following commands can be run to test out the dapp
```bash
quasar dev # STARTS THE VUE3 + QUASAR LOCAL SERVER
```
