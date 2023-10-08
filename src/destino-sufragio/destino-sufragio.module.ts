import { Module } from '@nestjs/common';
import { DestinoSufragioController } from './destino-sufragio.controller';
import { DestinoSufragioService } from './destino-sufragio.service';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [DestinoSufragioController],
  providers: [DestinoSufragioService]
})
export class DestinoSufragioModule {}
