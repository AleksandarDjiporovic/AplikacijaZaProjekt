import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {
  @Get() // http://localhost3000/
  getHello(): string {
    return 'Hello World!' ;
  }

  @Get('world') // http://localhost3000/world/
  getWorld(): string {
    return 'World!!!' ;
  }
}
