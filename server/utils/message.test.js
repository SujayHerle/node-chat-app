var expect =require('expect');

var {generateMessage} = require('./message.js');

describe('generateMessage',()=>{
it('should generate correct message object', ()=>{
  var from = 'Rin';
  var text = 'Some message';
  var message = generateMessage(from,text);

  expect(message.createdAt).toBeNumber();
  expect(message).toInclude({from,text});

});

});
