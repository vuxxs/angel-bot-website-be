import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';

@Module({
  imports: [],
  controllers: [AppController, DiscordController],
  providers: [AppService, DiscordService],
})
export class AppModule {}
