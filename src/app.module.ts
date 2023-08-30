import { Module } from '@nestjs/common';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { ConfigModule } from '@nestjs/config';
import { CandidatoPoliticoModule } from './candidato-politico/candidato-politico.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
    CandidatoPoliticoModule,
  ],
})
export class AppModule {}
