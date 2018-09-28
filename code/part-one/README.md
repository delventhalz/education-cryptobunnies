# Part One: DIY Blockchain

What better way to learn about blockchains than to build your own? In this
section you will construct your own simple blockchain in the vein of Bitcoin
and other cryptocurrencies. Using cryptographic private/public key pairs, users
will be able to create transactions sending funds from their public key to that
of another user. Like any other blockchain, these transactions will become a
permanent immutable part of the ledger, protected by the hashes that link each
block to the one that came before it in the chain.

## Contents

- [Getting Started and Running Tests](#getting-started-and-running-tests)
- [The Curriculum](#the-curriculum)
- [The Project](#the-project)
    * [01 Signing](#01-signing)
    * [02 Blockchain](#02-blockchain)
    * [03 Validation](#03-validation)
- [Extra Credit](#extra-credit)
    * [04 Mining](#04-mining)

## Getting Started and Running Tests

This section uses Node and npm to install dependencies and run tests. To begin,
first install [Node 8](https://nodejs.org/) or higher. Then run these commands
from your terminal:

```bash
cd code/part-one/
npm install
npm test
```

You should see a number of tests run, most of which are failing.

(╯︵╰,)

Your job, in short, is to make these tests pass. As you work your way through
the sections below, keep running `npm test` to check your progress and get
clues to what you should do next.


## The Curriculum

**Lectures:**
- [Cryptomoji _(25 min)_](../../reading/part-one/curriculum.md#cryptomoji)
- [Zulfikar Ramzan: Bitcoin _(45 min)_](../../reading/part-one/curriculum.md#zulfikar-ramzan-bitcoin)

**Written Material:**
- [Hashing](../../reading/part-one/curriculum.md#hashing)
- [Blockchain Data Structure](../../reading/part-one/curriculum.md#blockchain-data-structure)
- [Signing](../../reading/part-one/curriculum.md#signing)


## The Project

The intro blockchain project is broken into four modules, one of which is extra
credit:

- [01 Signing](../../reading/part-one/design.md#01-signing)
- [02 Blockchain](../../reading/part-one/design.md#02-blockchain)
- [03 Validation](../../reading/part-one/design.md#03-validation)
- [04 Mining _(Extra Credit)_](../../reading/part-one/design.md#04-mining)
