import { Module } from '@nestjs/common';
import { ClientProxyAppAdminitracion } from './client-proxy';

@Module({
  providers: [ClientProxyAppAdminitracion],
  exports: [ClientProxyAppAdminitracion],
})
export class ProxyModule {}
