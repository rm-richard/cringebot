var assert = require('assert');

describe('Basic Mocha String Tests', () => {
  it('should return the number of letters', () => {
    assert.equal('Hello'.length, 5);
  });

  it('should return the first character of the string', () => {
    assert.equal('Hello'.charAt(0), 'H');
  });
});
