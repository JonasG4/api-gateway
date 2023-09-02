import { Module } from '@nestjs/common';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
  ],
})
export class AppModule {}
