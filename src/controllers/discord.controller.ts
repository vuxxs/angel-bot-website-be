import { Controller, Get, Query, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { DiscordService } from '../services/discord.service';

@Controller('auth/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Session() session: any,
    @Res() res: Response,
  ) {
    try {
      const tokenResponse = await this.discordService.exchangeCodeForToken(
        code,
      );
      const userResponse = await this.discordService.getUserInfo(
        tokenResponse.access_token,
      );

      session.user = userResponse;

      res.redirect('/home');
    } catch (error) {
      console.error('Failed to log in with Discord:', error);
      res.redirect('/login');
    }
  }
}
