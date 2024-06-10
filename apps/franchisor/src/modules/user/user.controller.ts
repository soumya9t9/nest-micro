import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Inject, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiProperty, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public-stratergy';
import { Response } from 'express';
import { ProviderEnum, User } from './entities/user.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService) {}

  @ApiProperty({type: CreateUserDto})
  @ApiOkResponse({type: User})
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res:Response) {

    this.logger.info({ip: req.headers['x-forwarded-for']});
    this.logger.info({ip: req.socket.remoteAddress});
    
    this.userService.create({...createUserDto, provider: ProviderEnum.SELF}).subscribe(result => {
      res.json(result);
    }, (err) => {
      // res.writeHead(500);
      res.status(500).send(err)
    })
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneByProfileId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}


