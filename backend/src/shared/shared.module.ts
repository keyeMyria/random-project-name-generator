import { Global, Module } from '@nestjs/common';
import { MapperService } from './services/mapper/mapper.service';
import { configService, ConfigService } from './services/config/config.service';

@Global()
@Module({
  providers: [
    MapperService,
    {
      provide: ConfigService,
      useValue: configService,
    },
  ],
  exports: [
    MapperService,
    ConfigService,
  ],
})
export class SharedModule {
}
