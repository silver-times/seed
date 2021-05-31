import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CloudTasksService, FirebaseAuthService, PrismaService } from './services';
import { ApiKeyGuard, IsAuthenticatedGuard } from './guards';
import { CloudTaskCreateCommandHandler } from './commandHandlers';

const guards = [ApiKeyGuard, IsAuthenticatedGuard];
const services = [FirebaseAuthService, PrismaService, CloudTasksService];
const commandHandlers = [CloudTaskCreateCommandHandler];

const providers = [...guards, ...services];

@Global()
@Module({
  imports: [CqrsModule],
  providers: [...providers, ...commandHandlers],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}