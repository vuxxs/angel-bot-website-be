import { Module } from '@nestjs/common';
import { LoginController } from './controllers/login.controller';
import { DiscordController } from './controllers/discord.controller';
import { SessionController } from './controllers/session.controller';
import { DiscordService } from './services/discord.service';

@Module({
  imports: [],
  controllers: [LoginController, DiscordController, SessionController],
  providers: [DiscordService],
})
export class AppModule {}
