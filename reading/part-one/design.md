# DIY Blockchain Design

## Contents

- [01 Signing](#01-signing)
- [02 Blockchain](#02-blockchain)
- [03 Validation](#03-validation)
- [Extra Credit](#extra-credit)
    * [04 Mining](#04-mining)


## 01 Signing

**Module:** [signing.js](signing.js)

In this section, you will build a simple signing API using Secp256k1, a common
cryptographic algorithm used by Bitcoin, Ethereum, and Hyperledger Sawtooth.
The underlying math is rather complex, so we will be relying on the library
[secp256k1-node](https://github.com/cryptocoinjs/secp256k1-node) to do the
heavy lifting for us. Make sure you familiarize yourself with its API.

Note that this library uses [Node Buffers](https://nodejs.org/api/buffer.html)
(basically raw bytes) as the format of choice for keys and signatures. One of
your jobs will be to convert these bytes to and from hex strings, which are
slightly more convenient for our purposes. Make sure you are familiar with
Buffer's `from` and `toString` methods.

You will be implementing four stub methods:
- **createPrivateKey**
- **getPublicKey**
- **sign**
- **verify**


## 02 Blockchain

**Module:** [blockchain.js](blockchain.js)

You will implement your blockchain with three related ES6 classes:
- **Transaction**: A signed transfer of funds from one public key to another
- **Block**: A hashed collection of transactions with a previous hash
- **Blockchain**: An ordered collection of blocks, with a method to calculate
  balances

## 03 Validation

**Module:** [validation.js](validation.js)

Blockchain validation is a huge and varied topic. In Sawtooth, validation is so
important that the central component is named a "validator". For this section,
you get to be your own validator and finally verify all of the cryptographic
boilerplate that you've been including with your blocks and transactions.

You can use your `signing.verify` method to ensure that none of your
transactions have been tampered with. You should get a similar assurance for
your blocks if you recreate the hashes and make sure they match. Also, of
course, the chain of `previousHashes` should be unbroken all the way back to
your genesis block.

You'll be completing four methods, one to validate each data structure you
made, and one more just for fun, to try to tamper with your own blockchain:
- **isTransactionValid**
- **isBlockValid**
- **isChainValid**
- **breakChain**

## Extra Credit

While the next module can help you gain a deeper understanding of consensus
algorithms, and _Proof of Work_ in particular, you can feel free to move on to
[part two](../part-two/README.md) at this point. This section is strictly
optional.

To run the tests for this extra credit, remove the  `.skip` from the wrapping
`describe` block on Line 14 of
[tests/04-ExtraCredit-Mining.js](tests/04-ExtraCredit-Mining.js#L14).

### 04 Mining

**Module:** [mining.js](mining.js)

All this validation stuff is great, but what is to stop someone from coming in
and replacing huge sections of the blockchain with their own _valid_ blocks and
transactions? That is where _consensus_ comes in. A good consensus algorithm
like Proof of Work or
[Proof of Elapsed Time](https://medium.com/kokster/understanding-hyperledger-sawtooth-proof-of-elapsed-time-e0c303577ec1)
(one of the algorithms available to Sawtooth), feature _Byzantine
Fault Tolerance_: they not only ensure correctness, but also prevent bad actors
from taking over the system and rewriting large sections of the blockchain.
Zulfikar Ramzan does an excellent job of
[explaining how this works for Bitcoin](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-proof-of-work),
but the short version is that if you randomize who gets to create new blocks,
and always select the longest chain available, a bad actor would need to take
over 51% of the network to be effective. In a highly decentralized network,
this is hopefully impractical.

So now it's your turn. You will create some tweaked versions of your original
blockchain structure around a new method: `MineableChain.mine`. This method
will allow your miners to solve the same cryptographic problem that Bitcoin
miners do, building your blockchain as they go, and rewarding themselves for
their efforts. Bonus: This means there is now a source for new funds on your
blockchain, so you can also check that no one has a negative balance.

Three new classes:
- **MineableTransaction**
- **MineableBlock**
- **MineableChain**

One new validation method:
- **isMineableChainValid**