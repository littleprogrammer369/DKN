import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FarmsService } from './farms.service';

@Controller('farms')
@UseGuards(AuthGuard('jwt'))
export class FarmsController {
  constructor(private farmsService: FarmsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.farmsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.farmsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.farmsService.create({ ...body, userId: req.user.id });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.farmsService.remove(id, req.user.id);
  }
}
