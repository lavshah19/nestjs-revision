import { Module } from '@nestjs/common';
import { UserEventService } from './user-event.service';
import { UserRegisteredListener } from './listener/user-registered.listener';

@Module({
    providers: [UserEventService,UserRegisteredListener],
    exports: [UserEventService]
})
export class EventsModule {

    
}
