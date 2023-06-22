import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { SessionRequest } from './../interfaces/session-request.interface'; // adjust the path as needed

@Controller('session')
export class SessionController {
  @Get()
  getSession(@Req() req: SessionRequest, @Res() res: Response) {
    if (req.session.user) {
      res.json({ user: req.session.user, guilds: req.session.guilds });
    } else {
      res.status(401).send('Unauthorized');
    }
  }
}
