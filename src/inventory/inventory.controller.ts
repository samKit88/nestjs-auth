import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InveDto } from './dto/inve.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CategoryDto } from './dto/category.dto';
import { BrandDto } from './dto/brand.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private invService: InventoryService) {}

  @Get()
  getAll() {
    return this.invService.getAll();
  }

  @Get('/id')
  getById(@Param() param) {
    const reqId = param.id.parseInt;
    return this.invService.getByID(reqId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  @HttpCode(HttpStatus.OK)
  createNewinv(@Body() dto: InveDto, @Req() req: Request) {
    const user = req.user;
    return this.invService.createNewinv(dto, user['email']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create-category')
  @HttpCode(HttpStatus.OK)
  createCategory(@Body() dto: CategoryDto, @Req() req: Request) {
    const user = req.user;
    return this.invService.createNewCategory(dto, user['email']);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/create-brand')
  @HttpCode(HttpStatus.OK)
  createNewBrand(@Body() dto: BrandDto, @Req() req: Request) {
    const user = req.user;
    return this.invService.createNewBrand(dto, user['email']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  updateInventory(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: InveDto,
  ) {
    const user = req.user;
    const inventoryId = parseInt(id);
    return this.invService.updateInventory(inventoryId, user['email'], dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteInventory(@Param('id') id: string, @Req() req) {
    const user = req.user;
    const inventoryId = parseInt(id);
    console.log(inventoryId);
    return this.invService.deleteInventory(inventoryId, user['email']);
  }
}
