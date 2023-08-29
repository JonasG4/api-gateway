import { Module } from '@nestjs/common';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
  ],
})
export class AppModule {}
