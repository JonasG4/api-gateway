import { Module } from '@nestjs/common';
import { CandidatoPoliticoController } from './candidato-politico.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [CandidatoPoliticoController],
})
export class CandidatoPoliticoModule {}
