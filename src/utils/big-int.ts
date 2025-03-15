const BigInt = require('big-integer');
BigInt.asUintN = function (bits: any, bigint: any) {
  bigint = BigInt(bigint);
  if (typeof bigint.value === 'bigint') {
    return BigInt(BigInt.asUintN(bits, bigint.value));
  }
  const p2bits = BigInt(1).shiftLeft(bits);
  const mod = bigint.and(p2bits.subtract(1));
  return mod;
};
BigInt.asIntN = function (bits: any, bigint: any) {
  bigint = BigInt(bigint);
  if (typeof bigint.value === 'bigint') {
    return BigInt(BigInt.asIntN(bits, bigint.value));
  }
  const p2bits = BigInt(1).shiftLeft(bits);
  const mod = bigint.and(p2bits.subtract(1));
  return mod.greaterOrEquals(p2bits.subtract(mod)) ? mod.subtract(p2bits) : mod;
};

export default BigInt;
