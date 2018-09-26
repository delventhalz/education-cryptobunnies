# Part One Curriculum: Blockchain Concepts

## Contents
- [Lectures](#lectures)
    * [Cryptomoji](#cryptomoji)
    * [Zulfikar Ramzan: Bitcoin](#zulfikar-ramzan-bitcoin)
- [Core Concepts](#core-concepts)
    * [Hashing](#hashing)
        - [Additional Learning](#additional-learning)
        - [Useful APIs](#useful-apis)
    * [Blockchain Data Structure](#blockchain-data-structure)
        - [Additional Learning](#additional-learning1)
        - [Useful APIs](#useful-apis1)
    * [Signing](#signing)
        - [Additional Learning](#additional-learning2)
        - [Useful APIs](#useful-apis2)


## Lectures

### Cryptomoji

The first part of the Cryptomoji lecture is a brief overview of the blockchain
data structure and the technologies that power it: hashing, signatures, and
consensus. The lecture itself is 15 minutes long with an additional 10 minutes
of Q&A. They are hosted by HackReactor on their YouTube channel:

- [Blockchain Overview Lecture](https://youtu.be/YWa1lmFgsOA)
- [Blockchain Overview Questions](https://youtu.be/npGK4i6g41I)

In addition to the video, the slides are available in a variety of formats. The
general blockchain section is the first 8 slides:

- [Sawtooth App Development (Google Doc)](https://docs.google.com/presentation/d/1vRGIli6bgXP0FwdfZG7KrEIGS6apANnSCBk3Sg-5btc/edit?usp=sharing)
- [Sawtooth App Development (PPTX)](../../teaching/slides/sawtooth_app_development.pptx)
- [Sawtooth App Development (ODP)](../../teaching/slides/sawtooth_app_development.odp)
- [Sawtooth App Development (PDF)](../../teaching/slides/sawtooth_app_development.pdf)

### Zulfikar Ramzan: Bitcoin

For a deeper dive, follow up the lecture with Zulfikar Ramzan's excellent Khan
Academy course about the inner workings of the Bitcoin protocol. While your
blockchain will have some differences from Bitcoin (in particular the way
"inputs" and "outputs" are handled), there will be a lot of overlap:
- [Bitcoin: What is it?](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-what-is-it)
- [Bitcoin: Overview](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-overview)
- [Bitcoin: Cryptographic hash functions](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-cryptographic-hash-function)
- [Bitcoin: Digital signatures](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-digital-signatures)
- [Bitcoin: Transaction records](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-records)
- [Bitcoin: Proof of work](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-proof-of-work)
- [Bitcoin: Transaction blockchains](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-block-chains)
- [Bitcoin: The money supply](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-the-money-supply)
- [Bitcoin: The security of blockchains](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-security-of-transaction-block-chains)

You don't necessarily need to take the whole course, but makes sure you watch
(and absorb!) the videos on _hashing_, _signatures_, and _transaction
blockchains_. If you are going to tackle the extra credit, you will also want
to watch the videos on _proof of work_ and the _money supply_.


## Core Concepts

### Hashing

Before you can understand the blockchain data structure itself, you need to be
familiar with the concept of _hashing_: creating a deterministic digest of some
arbitrary data. Importantly, while the same data will always produce the same
hash, even a small change in the underlying data will create a completely
different digest:

```
SHA-512: 'Hello, World!' -> '374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387'

SHA-512: 'Hello, World?' -> '04d176b6977a4ee37d66e6c5b4a6cb9df46f73b453441af997b27f5f82c36bb18308b6ff5d29e4189fa41553e7ae7246db0482c9b78e42cbedc727f2ad639d9f'
```

You are free to use any hashing algorithm you like for this project, but your
best bet is to familiarize yourself with Node's crypto module. In
particular, use it to create SHA-512 hashes. This will come up later when you
start working with Hyperledger Sawtooth.

#### Additional Learning

 - [Bitcoin: Cryptographic hash functions (video)](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-cryptographic-hash-function)

#### Useful JS APIs

 - [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)


### Blockchain Data Structure

Now that you understand hashing, a blockchain should actually be rather
straightforward. It's just bundles of data linked sequentially by hashes of
that data. Start with a "genesis" block. This is the only block which won't be
linked to a previous hash. Then gather some data into a new block, combine it
with the genesis hash, and create a new hash. When more data comes in,
repeat the process: bundle the data into a new block, combine it with the
previous hash, and generate a new hash.

```javascript
[
  {
    data: '',
    hash: 'cf83e1357eefb8bd...'  // <- SHA-512: ''
  },
  {
    data: 'foo',
    previousHash: 'cf83e1357eefb8bd...',
    hash: '0bfc4817f6e1e5f3...'  // <- SHA-512: data + previousHash
  },
  {
    data: 'bar',
    previousHash: '0bfc4817f6e1e5f3...',
    hash: 'cef9981655e46b59...'  // <- SHA-512: data + previousHash
  }
]
```

Now all of your data is linked all the way back to your original genesis block.
If anyone attempts to tamper with the data in a block, the hashes will also
have to change. Anyone checking the chain of hashes would immediately see that
one does not match. In order to alter old data, you would have to modify not
only the target block, but _every_ block that comes after it.

#### Additional Learning

 - [Bitcoin: Transaction blockchains](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-block-chains)


### Signing

Signatures form the basis for verifiable identity and correctness on most, if
not all, blockchains. First, a _private key_ is generated; it's basically just
a random set of bytes. This key is kept secret. Next, a cryptographic algorithm
uses these bytes to derive a _public key_ which can be widely shared. Finally,
a _signature_ is generated by combining the private key with some message. This
signature, the message, and the public key are then all distributed together.

```
private key             message    private key
    |                         \     /
    v                          v   v
public key                   signature
```

While others won't ever be able to deduce the original private key, they will be
able to confirm that the public key and signature came from the _same_ private
key and that the message was not altered. Not even a single byte. This
powerful cryptographic tool is fundamental to how blockchains work.

```
public key -
             \
 signature - - - > ???
             /
   message -
```

#### Additional Learning

- [Bitcoin: Digital signatures (video)](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-digital-signatures)

#### Useful JS APIs

- [secp256k1-node](https://github.com/cryptocoinjs/secp256k1-node#usage)
- [Buffer.from](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding)
- [Buffer.toString](https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end)
