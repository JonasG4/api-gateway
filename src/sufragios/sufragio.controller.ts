import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SufragiosMSG } from 'src/common/constantes';
import { ISufragio } from 'src/common/interfaces/sufragios';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';

@Controller('api/v1/sufragios')
export class SufragioController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxySufragio = this.clientProxy.clientProxyDestinoSufragio();

  @Get()
  findAll(): Observable<ISufragio[]> {
    return this._clientProxySufragio.send(SufragiosMSG.FIND_ALL, '');
  }
}
