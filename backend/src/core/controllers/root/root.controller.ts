import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class RootController {
  @Get()
  index() {
    return 'Welcome to this awesome api!';
  }

  @Get('secret')
  @UseGuards(AuthGuard('jwt'))
  secret() {
    return 'This is an secret protected page!';
  }
}
