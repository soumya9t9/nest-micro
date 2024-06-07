import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Public } from '../auth/public-stratergy';
import { Response } from 'express';

@Public()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiProperty({type: CreateUserDto})
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res:Response) {
    this.userService.create(createUserDto).subscribe(result => {
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


