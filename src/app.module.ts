import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentroVotacionModule } from './centro-votacion/centro-votacion.module';
import { JuntaReceptoraVotosModule } from './junta-receptora-votos/junta-receptora-votos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    CentroVotacionModule,
    JuntaReceptoraVotosModule,
  ],
})
export class AppModule {}
