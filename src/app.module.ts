import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JuntaReceptoraVotosModule } from './junta-receptora-votos/junta-receptora-votos.module';
import { JrvMiembrosModule } from './jrv-miembros/jrv-miembros.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    JuntaReceptoraVotosModule,
    JrvMiembrosModule,
  ],
})
export class AppModule {}
