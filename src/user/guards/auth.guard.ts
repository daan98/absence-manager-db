import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RoleEnum } from '../interface';
import { UserService } from '../user.service';


@Injectable()
export class AuthGuard implements CanActivate {
    private roles = RoleEnum;
    constructor(
        private jwtService  : JwtService,
        private userService : UserService,
    ) {}

    async canActivate(context: ExecutionContext) : Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException('There is no bearer token.');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
            token, { secret: process.env.JWT_SEED }
            );

            const user = await this.userService.findOne(payload.id);

            if(!user) {
            throw new UnauthorizedException('User does not exists.');
            }

            if(user.role !== this.roles.admin) {
            throw new UnauthorizedException('Este usuario no tiene acceso al servicio.');
            }

            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = user;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request : Request) : string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
