import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { CandidatoPoliticoModule } from './candidato-politico/candidato-politico.module';
import { CentroVotacionModule } from './centro-votacion/centro-votacion.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
    CandidatoPoliticoModule,
    CentroVotacionModule,
  ],
})
export class AppModule {}
