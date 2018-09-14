import * as encoding from '../source/services/encoding.js';


describe('Encoding module', function() {

  describe('encode', function() {
    const toEncode = { hello: 'world', foo: 'bar' };

    it('should return a Buffer or an Uint8Array', function() {
      const encoded = encoding.encode(toEncode);
      expect(encoded).to.be.bytes;
    });

    it('should return a Buffer, parseable as a JSON string', function() {
      const encoded = encoding.encode(toEncode);
      const stringified = encoded.toString();
      expect(() => JSON.parse(stringified)).to.not.throw();
    });

    it('should return a sorted JSON string', function() {
      const encoded = encoding.encode(toEncode);
      const stringified = encoded.toString();
      const helloIndex = stringified.indexOf('hello');
      const fooIndex = stringified.indexOf('foo');

      expect(helloIndex).to.not.equal(-1);
      expect(fooIndex).to.not.equal(-1);
      expect(fooIndex).to.be.lessThan(helloIndex);
    });

    it('should be parseable to the original object', function() {
      const encoded = encoding.encode(toEncode);
      const decoded = JSON.parse(encoded.toString());
      expect(decoded).to.deep.equal(toEncode);
    });

  });

  describe('decode', function() {
    const toEncode = { hello: 'world', foo: 'bar' };
    let encoded = null;

    beforeEach(function() {
      encoded = encoding.encode(toEncode).toString('base64');
    });

    it('should take a base64 encoded Buffer and return an object', function() {
      const decoded = encoding.decode(encoded);
      expect(decoded).to.be.an('object');
    });

    it('should return an object that matches the encoded object', function() {
      const decoded = encoding.decode(encoded);
      expect(decoded).to.deep.equal(toEncode);
    });

  });

});
