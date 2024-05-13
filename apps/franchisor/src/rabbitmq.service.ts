import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
@Injectable()
export class RabbitMQService {
  constructor(
    // @Inject('RMQ_SERVICE') private readonly client: ClientProxy,
    @Inject('GATEWAY_SERVICE') private readonly clientServiceTCP: ClientProxy,
  ) {}
  // public send(pattern: string, data: any) {
  //   return this.client.send(pattern, data).toPromise();
  // }

  public pingServiceTCP() {
    const pattern = { cmd: 'wrong' };
    const payload = {};
    return this.clientServiceTCP
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message })),
      );
  }
}