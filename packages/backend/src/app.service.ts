import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getAnother(): string {
    return 'Another thing!';
  }
  getLastBlock(): any {
    const provider = ethers.getDefaultProvider('goerli');
    return provider.getBlock('latest');
  }
}
