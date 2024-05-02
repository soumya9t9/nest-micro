import { Injectable } from '@nestjs/common';

@Injectable()
export class FranchisorService {
  getHello(): string {
    return 'Hello World! from Franchisor';
  }
}
