import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PestsService } from './pests.service';
import { CreatePestDto, UpdatePestDto, DetectDto } from './dto/pest.dto';

@Controller('pests')
@UseGuards(AuthGuard('jwt'))
export class PestsController {
  constructor(private s: PestsService) {}
  @Get('threats/:farmId') getThreats(@Param('farmId') f: string) { return this.s.getActiveThreats(f); }
  @Get('risk/:farmId') getRisk(@Param('farmId') f: string) { return this.s.getRiskLevel(f); }
  @Get('all') all(@Request() r: any) { return this.s.all(r.user.id); }
  @Get('assessment/:farmId') assessment(@Param('farmId') f: string) { return this.s.assessment(f); }
  @Post('detect') detect(@Body() b: DetectDto) { return this.s.detect(b.image, b.mimeType, b.farmId); }
  @Get('farm/:farmId') list(@Param('farmId') f: string, @Request() r: any) { return this.s.list(f, r.user.id); }
  @Get('farm/:farmId/:id') view(@Param('farmId') f: string, @Param('id') id: string, @Request() r: any) { return this.s.view(id, f, r.user.id); }
  @Post('farm/:farmId') create(@Param('farmId') f: string, @Body() b: CreatePestDto, @Request() r: any) { return this.s.create(f, r.user.id, b); }
  @Patch('farm/:farmId/:id') update(@Param('farmId') f: string, @Param('id') id: string, @Body() b: UpdatePestDto, @Request() r: any) { return this.s.update(id, f, r.user.id, b); }
  @Delete('farm/:farmId/:id') remove(@Param('farmId') f: string, @Param('id') id: string, @Request() r: any) { return this.s.remove(id, f, r.user.id); }
}
