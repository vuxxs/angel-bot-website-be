import { Request } from 'express';
import session from 'express-session';

interface SessionData {
  user?: any;
  guilds?: any;
}

export interface SessionRequest extends Request {
  session: SessionData & session.Session;
}
