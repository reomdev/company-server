import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  test(): string {
    return '[200] App running';
  }
}
