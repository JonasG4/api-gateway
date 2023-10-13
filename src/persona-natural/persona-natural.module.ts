import { Module } from '@nestjs/common';
import { PersonaNaturalController } from './persona-natural.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [PersonaNaturalController],
})
export class PersonaNaturalModule {}
