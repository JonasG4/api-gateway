import { Module } from '@nestjs/common';
import { PartidoPoliticoController } from './partido-politico.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [PartidoPoliticoController],
})
export class PartidoPoliticoModule {}
