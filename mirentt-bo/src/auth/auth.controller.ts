import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';

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

    @Post('register')
    async register(@Body() user: User, @Res() res) {
        try {
            
            const registeredUser = await this.authService.registerUser(user);
            return res.status(HttpStatus.CREATED).json({
                message: 'User registered successfully',
                user: registeredUser,
            });
        } catch (error) {

            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message || 'Failed to register user',
            });
        }
    }

    @Post('logout')
    async logout(@Body('token') token: string, @Res() res) {
      try {
        await this.authService.logout(token);
        return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
    
}
