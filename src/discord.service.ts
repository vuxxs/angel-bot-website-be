/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { stringify } from 'querystring';

dotenv.config();

@Injectable()
export class DiscordService {
  private clientId = process.env.DISCORD_CLIENT_ID;
  private clientSecret = process.env.DISCORD_CLIENT_SECRET;
  private redirectUri = encodeURIComponent(process.env.REDIRECT_URI);

  generateAuthUrl(): string {
    const queryParams = stringify({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'identify guilds',
    });
    return `https://discord.com/api/oauth2/authorize?${queryParams}`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const data = stringify({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      scope: 'identify guilds',
    });

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      data,
      config,
    );

    return response.data;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      'https://discord.com/api/users/@me',
      config,
    );

    return response.data;
  }
}
