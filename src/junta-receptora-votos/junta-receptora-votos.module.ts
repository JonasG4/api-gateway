import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { JuntaReceptoraVotosController } from './junta-receptora-votos.controller';


@Module({
  imports: [ProxyModule],
  controllers: [JuntaReceptoraVotosController],
})
export class JuntaReceptoraVotosModule {}
