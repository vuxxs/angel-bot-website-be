import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { SessionRequest } from 'src/interfaces/session-request.interface';

@Controller()
export class LoginController {
  @Get('login')
  async login(
    @Query('code') code: string,
    @Res() res: Response,
    @Res() req: SessionRequest,
  ) {
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3001/login',
      code: code,
      scope: 'identify guilds',
    };

    try {
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

      // Handle the retrieved user and guild information as needed
      req.session.user = user;
      req.session.guilds = guilds;

      res.redirect('http://localhost:3000/home');
      res.send('Login successful');
    } catch (error) {
      console.error('OAuth Error:', error);
      console.log('Response Data:', error.response?.data);
      // Handle error
      res.status(500).json({ error: 'OAuth Error' });
    }
  }

  // Implement the methods to retrieve user and guild information from Discord's API
  async getUser(token: string) {
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
