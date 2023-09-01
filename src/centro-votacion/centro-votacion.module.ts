import { Module } from '@nestjs/common';
import { CentroVotacionController } from './centro-votacion.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [CentroVotacionController],
})
export class CentroVotacionModule {}
