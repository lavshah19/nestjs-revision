import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { userRegisterEvent } from "../user-event.service";






@Injectable()
export class UserRegisteredListener {
    private readonly logger = new Logger(UserRegisteredListener.name);
    @OnEvent('user.registered')
    handleUserRegisteredEvent(event: userRegisterEvent) : void {
        this.logger.log(`User registered: ${JSON.stringify(event)}`);
        
    }
}

