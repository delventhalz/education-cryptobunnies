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
familiar with the concept of _hashing_. Hashing algorithms take data and create
a deterministic one-way "digest". The same data will always produce the same
hash, and you cannot use the digest to recover the original data.

For example, a simple hashing algorithm we could run in our heads might be to
sum the digits in a number:
```
123  ->  1 + 2 + 3  ->  6
468  ->  4 + 6 + 8  ->  18  ->  1 + 8  ->  9
```

With this example, some of the qualities of a hash are immediately visible.
Starting with `123` will always result in a digest of `6`. And if we only have
the hash, it is impossible to know we started with `123` originally. However,
our summing algorithm fails as _cryptographic_ hash.

To be suitable for cryptography a hashing algorithm must feature a number of
useful qualities:
- _Deterministic_: The same input always produces the same digest
- _One way_: It is nearly impossible to recover the input from the digest
- _Fixed length_: Every digest is of the same length regardless of input
- _Pseudo-random_: A small change to the input results in a vastly different
  digest
- _Collision resistant_: It is nearly impossible to find two inputs which
  produce the same digest

A common cryptographic hash used in blockchains today is the _SHA-2_ algorithm.
SHA-2 has two common variants, SHA-256 and SHA-512, which produce digests of
256 bits and 512 bits in length respectively. If we run two variations of a
simple string message through SHA-256 and output the resulting bytes as hex
strings, we can see how it satisfies all of our above conditions:
```
'Hello, World!'  ->  SHA-512  ->  'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f'

'Hello, World?'  ->  SHA-512  ->  'f16c3bb0532537acd5b2e418f2b1235b29181e35cffee7cc29d84de4a1d62e4d'
```

Just modifying a single character resulted in a completely different hash. And
with 2<sup>256</sup> possible digests, it is extremely unlikely we will _ever_
see a collision.

#### Additional Learning

 - [Bitcoin: Cryptographic hash functions (video)](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-cryptographic-hash-function)
 - [Virginia Tech: Hashing Tutorial](http://research.cs.vt.edu/AVresearch/hashing/)

#### Useful JS APIs

 - [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)


### Blockchain Data Structure

Now that you understand hashing, the blockchain data structure should actually
be rather straightforward. It's just "blocks" of data linked sequentially by
hashes to previous data. Start with a "genesis" block. This is special, the
only block which is allowed to not be linked to a previous one. Then gather
some data into a new block, combine it with the genesis hash, and create a new
hash. When more data comes in, repeat the process: bundle the data into a new
block, combine it with the previous hash, and generate a new hash.

```javascript
[
  {
    data: '',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'  // sha256('')
  },
  {
    data: 'foo',
    previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    hash: 'b7d0fc2b421dd7e92dd52692de8c7734ab006373f29dae7a2c7b01b9ded0d4af'  // sha256(data + previousHash)
  },
  {
    data: 'bar',
    previousHash: 'b7d0fc2b421dd7e92dd52692de8c7734ab006373f29dae7a2c7b01b9ded0d4af',
    hash: '27513c873f88deea8f7d2b8443b0a97b418dba12b648ec64963b26c884c31212'  // sha256(data + previousHash)
  }
]
```

Now all of your data is linked all the way back to your original genesis block.
If anyone attempts to reorder blocks or tamper with the data they contain, the
hashes will no longer match. Anyone checking this "chain" of hashes will
immediately see the discrepancy. This is why a blockchain is considered
_immutable_. In order to alter old data, you would have to modify not only the
target block, but every block that comes after it.

#### Additional Learning

 - [Bitcoin: Transaction blockchains](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-block-chains)


### Signing

Signatures form the basis for verifiable identity and correctness on most, if
not all, blockchains. First, a _private key_ is generated; it's basically just
a random set of bytes. This key is kept secret. Next, a cryptographic algorithm
uses these bytes to derive a _public key_ which can be widely shared. Finally,
a _signature_ is generated by combining the private key with some message. The
processes for deriving both a public key and a signature share many
similarities with hashing. They are one-way and deterministic, and the output
is fixed-length, collision resistant, and seemingly random.

```
private key          private key    message
    |                         \     /
    v                          v   v
public key                   signature
```

The public key, signature, and original message are then distributed together.
Others will never be able to deduce the original private key, but they will be
able to confirm that the public key and signature came from the _same_ private
key and that the message was not altered. Not even a single byte. This powerful
cryptographic tool is fundamental to how blockchains work.

```
public key -
             \
 signature - - - > ???
             /
   message -
```

#### Additional Learning

- [Bitcoin: Digital signatures (video)](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-digital-signatures)
- [TutorialsPoint: Cryptography Digital Signatures](https://www.tutorialspoint.com/cryptography/cryptography_digital_signatures.htm)

#### Useful JS APIs

- [secp256k1-node](https://github.com/cryptocoinjs/secp256k1-node#usage)
- [Buffer.from](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding)
- [Buffer.toString](https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end)
- [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)
