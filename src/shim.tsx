if (typeof BigInt === 'undefined') {
    const bigInt = require('big-integer');
    bigInt.asUintN = function (bits:any, bigint:any) {
      bigint = bigInt(bigint);
      if (typeof bigint.value === 'bigint') {
        return bigInt(BigInt.asUintN(bits, bigint.value));
      }
      const p2bits = bigInt(1).shiftLeft(bits);
      const mod = bigint.and(p2bits.subtract(1));
      return mod;
    };
    bigInt.asIntN = function (bits:any, bigint:any) {
      bigint = bigInt(bigint);
      if (typeof bigint.value === 'bigint') {
        return bigInt(BigInt.asIntN(bits, bigint.value));
      }
      const p2bits = bigInt(1).shiftLeft(bits);
      const mod = bigint.and(p2bits.subtract(1));
      return mod.greaterOrEquals(p2bits.subtract(mod))
        ? mod.subtract(p2bits)
        : mod;
    };
    global.BigInt = bigInt;
}