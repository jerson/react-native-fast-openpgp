import { NativeModules } from 'react-native';

type FastOpenpgpType = {
  multiply(a: number, b: number): Promise<number>;
};

const { FastOpenpgp } = NativeModules;

export default FastOpenpgp as FastOpenpgpType;
