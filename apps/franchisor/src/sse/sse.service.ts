import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { EntitySubscriberInterface } from 'typeorm';
import { ISseService } from './sse.interface';

type EventObject = {
    count?: number;
    eventSubject: Subject<MessageEvent>;
};

@Injectable()
export class SseService implements ISseService {
    private readonly allSubscribedUsers: Map<number, EventObject[]> = new Map();

    constructor() { }

    createConnection(id) {
        const eventSubject = new Subject<MessageEvent>()
        if (this.allSubscribedUsers.has(id)) {
            const existing: EventObject[] = this.allSubscribedUsers.get(id) || [];
            this.allSubscribedUsers.set(id, [
                ...existing,
                {
                    eventSubject,
                    count: existing.length + 1,
                }]);
        } else {
            this.allSubscribedUsers.set(id, [{
                count: 1,
                eventSubject,
            }]);
        }
        eventSubject;
    }

    notifyToOne(userId, data: any) {
        if (this.allSubscribedUsers.has(userId))
            this.allSubscribedUsers.get(userId).forEach(eachConnection => {
                eachConnection.eventSubject.next({
                    data,
                } as MessageEvent);
            })
    }

    notifyToAll(data: any) {
        Array.from(this.allSubscribedUsers.values()).forEach(eachUserId => {
            eachUserId.forEach(eachConnection => {
                eachConnection.eventSubject.next({
                    data,
                } as MessageEvent);
            })
        })
    }

    removeUser(id: number): void {
        if (this.allSubscribedUsers.has(id)) {
          const existing = this.allSubscribedUsers.get(id);
          if (existing.length === 1) {
            this.allSubscribedUsers.delete(id);
          } else {
            this.allSubscribedUsers.set(id, existing.filter(() => true));
          }
        }
      }

}
