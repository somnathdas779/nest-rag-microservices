import { All, Controller, Req, Res } from '@nestjs/common';
import { TusUploadService } from './tus-upload.service';

@Controller()
export class UploadController {
  constructor(private readonly tusService: TusUploadService) {}

  @All('*')
  handleTus(@Req() req, @Res() res) {
    // Forward request to tus-node-server
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.tusService.getHandler()(req, res);
  }
}
