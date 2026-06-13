import {Injectable} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/auth/entities/user.entity';


export interface userRegisterEvent{
    user:{
        id: number;
        name: string;
        email: string;
    },
    timestamp: Date
}



@Injectable()
export class UserEventService {
    constructor(
        private eventEmitter: EventEmitter2
    ){}
    emitUserRegisteredEvent(user: User){
        const event : userRegisterEvent = {
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            },
            timestamp: new Date()
        }
        this.eventEmitter.emit('user.registered', event);
    }
}