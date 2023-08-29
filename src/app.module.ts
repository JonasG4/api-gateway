import { Module } from '@nestjs/common';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { ConfigModule } from '@nestjs/config';
import { CentroVotacionModule } from './centro-votacion/centro-votacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
    CentroVotacionModule,
  ],
})
export class AppModule {}
