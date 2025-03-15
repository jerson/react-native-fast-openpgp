if (typeof global.BigInt === 'undefined') {
  const BigInt = require('./utils/big-int').default;
  global.BigInt = BigInt;
}

if (typeof global.TextDecoder === 'undefined') {
  const TextDecoder = require('./utils/text-decoder').default;
  global.TextDecoder = TextDecoder;
}

if (typeof global.TextEncoder === 'undefined') {
  const TextEncoder = require('./utils/text-encoder').default;
  global.TextEncoder = TextEncoder;
}
