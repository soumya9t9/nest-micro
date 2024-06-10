import { ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../modules/auth/public-stratergy';
import { UserAuthService } from '../modules/auth/user-auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		@Inject(Reflector) private readonly reflector: Reflector,
		private readonly userAuthService: UserAuthService
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
				context.getHandler(),
				context.getClass()
			]);

			if (isPublic) {
				return true;
			}

			const request = context.switchToHttp().getRequest();
			const { authorization }: any = request.headers;
			if (!authorization || authorization.trim() === '') {
				throw new UnauthorizedException('Please provide valid token');
			}
			const authToken = authorization.replace(/bearer/gim, '').trim();
			const resp = await this.userAuthService.validateToken(authToken, request.sessionId);
			request.decodedData = resp;
			return resp;
		} catch (error) {
			console.log('auth error - ', error.message);
			throw new ForbiddenException(error.message || 'session expired! Please sign In');
		}
	}
}
