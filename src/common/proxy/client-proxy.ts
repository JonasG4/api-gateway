import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RabbitMQ } from '../constantes';

@Injectable()
export class ClientProxyAppAdminitracion {
  constructor(private readonly config: ConfigService) {}

  clientProxyPartidosPoliticos(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.PartidosPoliticosQueue,
      },
    });
  }

  clientProxyJuntaReceptoraVotos(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.JuntaReceptoraVotosQueue,
      },
    });
  }

  clientProxyCentrosVotacion(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.CentrosVotacionQueue,
      },
    });
  }

  clientProxyPersonaNatural(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.PersonaNaturalQueue,
      },
    });
  }

  clientProxyCandidatosPoliticos(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.CandidatosPoliticosQueue,
      },
    });
  }

  clientProxyUsuarios(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.UsuarioQueue,
      },
    });
  }
  clientProxyDestinoSufragio(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.DestinoSufragioQueue,
      },
    });
  }

  clientProxySugragios(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.SufragiosQueue,
      },
    });
  }
}
