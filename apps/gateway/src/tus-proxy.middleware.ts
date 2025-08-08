import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
// import { AuthGuard } from './auth.guard';

@Injectable()
export class TusProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'http://localhost:3001', // Expose tus pods via a Kubernetes Service (ClusterIP or LoadBalancer)
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/files': '/files',
    },
    // logLevel: 'debug',
  });

  //   private authGuard = new AuthGuard();

  use(req: any, res: any, next: () => void) {
    // Manually run auth guard check
    // if (!this.authGuard.canActivate({ switchToHttp: () => ({ getRequest: () => req }) } as any)) {
    //   res.statusCode = 401;
    //   return res.end('Unauthorized');
    // }

    this.proxy(req, res, next);
  }
}
