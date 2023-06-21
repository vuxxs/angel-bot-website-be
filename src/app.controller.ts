import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { Response } from 'express';
import { DiscordService } from './discord.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly discordService: DiscordService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login')
  async login(@Query('code') code: string, @Res() res: Response) {
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/home',
      code: code,
      scope: 'identify guilds',
    };

    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams(data),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const token = response.data.access_token;
    const user = await this.getUser(token);
    const guilds = await this.getGuilds(token);

    // Store the user's information and token securely
    res.cookie('access_token', token, { httpOnly: true, secure: true });
    res.json({ user, guilds });
  }

  async getUser(@Query('token') token: string) {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async getGuilds(token: string) {
    const response = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  }
}
