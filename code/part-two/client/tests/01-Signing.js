import * as secp256k1 from 'secp256k1';
import { randomBytes, createHash } from 'crypto';
import * as signing from '../source/services/signing.js';


describe('Signing module', function() {

  describe('createPrivateKey', function() {

    it('should return a hexadecimal string', function() {
      const privateKey = signing.createPrivateKey();
      expect(privateKey).to.be.a.hexString;
    });

    it('should generate a valid Secp256k1 private key', function() {
      const privateKey = signing.createPrivateKey();
      const privateKeyBytes = Buffer.from(privateKey, 'hex');
      expect(secp256k1.privateKeyVerify(privateKeyBytes)).to.be.true;
    });

  });

  describe('getPublicKey', function() {
    let privateKey = null;

    beforeEach(function() {
      privateKey = signing.createPrivateKey();
    });

    it('should return a hexadecimal string', function() {
      const publicKey = signing.getPublicKey(privateKey);
      expect(publicKey).to.be.a.hexString;
    });

    it('should return a valid Secp256k1 public key', function() {
      const publicKey = signing.getPublicKey(privateKey);
      const publicKeyBytes = Buffer.from(publicKey, 'hex');
      expect(secp256k1.publicKeyVerify(publicKeyBytes)).to.be.true;
    });

    it('should return a public key derived from a private key', function() {
      const publicKey = signing.getPublicKey(privateKey);
      const privateKeyBytes = Buffer.from(privateKey, 'hex');
      const generatedPublicKey = secp256k1
        .publicKeyCreate(privateKeyBytes)
        .toString('hex');

      expect(publicKey).to.equal(generatedPublicKey);
    });

  });

  describe('createKeys', function() {

    it('should return an object with two keys', function() {
      const keys = signing.createKeys();
      expect(keys).to.have.property('privateKey');
      expect(keys).to.have.property('publicKey');
    });

    it('should have keys that are hexadecimal strings', function() {
      const { privateKey, publicKey } = signing.createKeys();

      expect(privateKey).to.be.a.hexString;
      expect(publicKey).to.be.a.hexString;
    });

    it('should generate valid Secp256k1 keys', function() {
      const { privateKey, publicKey } = signing.createKeys();
      const privateKeyBytes = Buffer.from(privateKey, 'hex');
      const publicKeyBytes = Buffer.from(publicKey, 'hex');

      expect(secp256k1.privateKeyVerify(privateKeyBytes)).to.be.true;
      expect(secp256k1.publicKeyVerify(publicKeyBytes)).to.be.true;
    });

    it('should have a public key derived from its private key', function() {
      const { privateKey, publicKey } = signing.createKeys();
      const privateKeyBytes = Buffer.from(privateKey, 'hex');
      const generatedPublicKey = secp256k1
        .publicKeyCreate(privateKeyBytes)
        .toString('hex');

      expect(publicKey).to.equal(generatedPublicKey);
    });

  });

  describe('sign', function() {
    // Generate random bytes, mimicking an encoded transaction header
    const message = randomBytes(Math.floor(Math.random() * 256));
    let privateKey = null;
    let publicKey = null;

    beforeEach(function() {
      const keys = signing.createKeys();
      privateKey = keys.privateKey;
      publicKey = keys.publicKey;
    });

    it('should return a hex string', function() {
      const signature = signing.sign(privateKey, message);
      expect(signature).to.be.a.hexString;
    });

    it('should create a valid signature', function() {
      const signature = signing.sign(privateKey, message);
      const publicKeyBytes = Buffer.from(publicKey, 'hex');
      const signatureBytes = Buffer.from(signature, 'hex');
      const messageHash = createHash('sha256').update(message).digest();
      const isValid = secp256k1.verify(
        messageHash,
        signatureBytes,
        publicKeyBytes
      );

      expect(isValid).to.be.true;
    });

  });

});
