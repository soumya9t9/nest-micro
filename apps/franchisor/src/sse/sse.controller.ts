import { Body, Controller, Get, Post, RawBody, Res, Sse } from '@nestjs/common';
import { Observable, fromEvent, map, of } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
    private eventEmitter: EventEmitter2;
    res: Response;
    constructor(private sseService: SseService) {

        this.eventEmitter = new EventEmitter2();
    }
    @Get('subscribe')
    subscribe(@Res() res: Response) {
        res.writeHead(200, {
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*"
        });
        this.res = res
        res.flushHeaders();
    }

    @Sse('connect')
    sse(@Res() res: Response): any | Observable<MessageEvent> {
        res.setHeader('Connection', "keep-alive");
        res.setHeader('Content-Type', "text/event-stream");
        res.setHeader('Cache-Control', "no-cache");
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.setHeader('Content-Encoding', 'none');
        res.flushHeaders();
        // res.setHeader({
        //     Connection: "keep-alive",
        //     "Content-Type": "text/event-stream",
        //     "Cache-Control": "no-cache",
        //     "Access-Control-Allow-Origin": "*"
        // });
        // res.socket.write('lol')
        // return of(new MessageEvent('new-orderrrr', { data: 'new order' }));
        // return fromEvent(this.eventEmitter, 'new-order').pipe(
        //     map((data) => {
        //     }),
        // );
        // res.write('');

        return this.sseService.createConnection(111);
    }

    @Post('emit')
    emit() {
        this.eventEmitter.emit('new-order');
        // this.res.fl
        this.res.write('id: ' + id + '\n');
        this.res.flush()
        return { result: 'ok' };
    }

    @Post('notify')
    notifyAll(@Res() res, @RawBody() data) {
        // this.eventEmitter.emit('new-order');
        // this.res.fl
        // return { result: 'ok' };
        this.sseService.notifyToOne(111, data);
        res.send('')
    }

}
