import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { SufragioController } from './sufragio.controller';

@Module({
  imports: [ProxyModule],
  controllers: [SufragioController],
})
export class SufragioModule {}
