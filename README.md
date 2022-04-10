# Ball Street Daohack PoC

https://hack.ethglobal.com/daohacks project submition

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



## Front-end
All frontend related code can be found under "/quasar"
- Vue3: chosen framework
- Quasar: for pre-built components
- Ethers: for connecting to chain
