import { BigNumber } from 'ethers';

export type Campaign = {
  name: string;
  duration: BigNumber;
  tokenLockInRequired: BigNumber;
};
