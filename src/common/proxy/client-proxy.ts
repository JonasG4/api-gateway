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

  clientProxyJuntaReceptoraVotos(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.JuntaReceptoraVotosQueue,
      },
    });
  }

  clientProxyJrvMiembros(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.JrvMiembrosQueue,
      },
    });
  }
}
