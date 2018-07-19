import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../shared/services/config/config.service';
import * as mg from 'mailgun.js';

@Injectable()
export class MailService {
  private mgClient;

  constructor(private readonly configService: ConfigService) {
    this.mgClient = mg.client({
      username: this.configService.get('MAILGUN_USERNAME'),
      key: this.configService.get('MAILGUN_API_KEY'),
    });
  }
}
