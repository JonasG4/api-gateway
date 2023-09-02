import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { CandidatoPoliticoModule } from './candidato-politico/candidato-politico.module';
import { CentroVotacionModule } from './centro-votacion/centro-votacion.module';
import { JuntaReceptoraVotosModule } from './junta-receptora-votos/junta-receptora-votos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    CandidatoPoliticoModule,
    CentroVotacionModule,
    JuntaReceptoraVotosModule,
  ],
})
export class AppModule {}
