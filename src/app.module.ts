import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CandidatoPoliticoModule } from './candidato-politico/candidato-politico.module';
import { CentroVotacionModule } from './centro-votacion/centro-votacion.module';
import { JuntaReceptoraVotosModule } from './junta-receptora-votos/junta-receptora-votos.module';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PersonaNaturalModule } from './persona-natural/persona-natural.module';
import { DestinoSufragioModule } from './destino-sufragio/destino-sufragio.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { SufragioModule } from './sufragios/sufragio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    CandidatoPoliticoModule,
    CentroVotacionModule,
    JuntaReceptoraVotosModule,
    PartidoPoliticoModule,
    AuthModule,
    UsuariosModule,
    PersonaNaturalModule,
    DestinoSufragioModule,
    SufragioModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
