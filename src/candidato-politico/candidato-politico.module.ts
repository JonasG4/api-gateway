import { Module } from '@nestjs/common';
import { CandidatoPoliticoController } from './candidato-politico.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [ProxyModule],
  controllers: [CandidatoPoliticoController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class CandidatoPoliticoModule {}
