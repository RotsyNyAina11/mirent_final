import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    async login(@Body() user: User, @Res() res) {
      const validatedUser = await this.authService.validateUser(user.email, user.password);
      if (validatedUser) {
        const token = await this.authService.login(validatedUser);
        return res.status(HttpStatus.OK).json(token);
      }
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
}
