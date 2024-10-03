import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // check req header have a token
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const requiredRoles = this.reflector.get(ROLES_KEY, context.getClass());
    console.log('The roles are', requiredRoles);

    const userRole = request.user.role;

    console.log(userRole);
    if (requiredRoles !== userRole) return false;

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.userId;
    } catch (e) {
      Logger.error(e.message);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('anuthorized');
    }
    return authHeader.split(' ')[1];
  }
}
