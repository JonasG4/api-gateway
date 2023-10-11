import { Module } from '@nestjs/common';
import { CentroVotacionController } from './centro-votacion.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [ProxyModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [CentroVotacionController],
})
export class CentroVotacionModule {}
