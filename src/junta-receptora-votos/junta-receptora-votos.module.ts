import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { JuntaReceptoraVotosController } from './junta-receptora-votos.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Module({
  imports: [ProxyModule],
  controllers: [JuntaReceptoraVotosController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class JuntaReceptoraVotosModule {}
