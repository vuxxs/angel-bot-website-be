import { Controller, Get, Req, Res, Delete } from '@nestjs/common';
import { Response } from 'express';
import { SessionRequest } from './../interfaces/session-request.interface';

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

  @Delete()
  clearSession(
    @Req() req: SessionRequest,
    @Res() res: Response,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          // handle error case
          res.status(500).send('Could not clear session');
          reject(err);
        } else {
          // session data cleared
          res.clearCookie('session');
          res.status(200).send('Session cleared');
          resolve();
        }
      });
    });
  }
}
