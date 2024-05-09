import { Body, Controller, Get, Post, Request, Res, Sse } from '@nestjs/common';
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
			Connection: 'keep-alive',
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Access-Control-Allow-Origin': '*'
		});

        // res.setHeader('Connection', 'keep-alive');
		// res.setHeader('Content-Type', 'text/event-stream');
		// res.setHeader('Cache-Control', 'no-cache');
		// res.setHeader('Access-Control-Allow-Origin', '*');
		// res.setHeader('Content-Encoding', 'none');

		this.res = res;
		res.flushHeaders();
	}

    @Post('emit')
    emit() {
        this.eventEmitter.emit('new-order');
        this.res.write('hello');
        return { result: 'ok' };
    }

    /* working */
	@Sse('connect')
	sse(@Res() res: Response): any | Observable<MessageEvent> {
		return this.sseService.createConnection(111);
	}

	@Post('notify')
	notifyAll(@Res() res, @Body() data) {
		this.sseService.notifyToOne(111, data);
		res.json({message: 'notified', data});
	}

    /* working */
	@Sse('events')
	events(@Request() req) {
		return fromEvent(this.eventEmitter, 'eventName');
	}

	@Post('events-push')
	async eventsPush() {
		this.eventEmitter.emit('eventName', { data: { emitting: new Date().toISOString() } });
		return { ok: true };
	}
}
