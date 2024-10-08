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
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InveDto } from './dto/inve.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CategoryDto } from './dto/category.dto';
import { BrandDto } from './dto/brand.dto';
import { QueryDto } from './dto/query.dto';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inventory')
export class InventoryController {
  constructor(private invService: InventoryService) {}

  @Get()
  getAll(@Query() queryDto: QueryDto) {
    const page = parseInt(queryDto.page || `${DEFAULT_PAGE}`);
    const limit = parseInt(queryDto.limit || `${DEFAULT_PAGE_SIZE}`);

    // console.log(queryDto.sort);
    return this.invService.getAll(page, limit, queryDto);
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

  @Post('/:id/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return 'file is not there bro';
    }
    const inventoryId = parseInt(id);
    const fileUrl = `uploads/${file.filename}`;
    return this.invService.uploadImage(inventoryId, fileUrl);
  }

  @Get('/:id/image')
  getImageById(@Param('id') id: string) {
    const inventoryId = parseInt(id);
    return this.invService.getImageById(inventoryId);
  }

  @Delete('/:id/image/:imageId')
  deleteImageById(@Param('id') id: string, @Param('imageId') imageId: string) {
    const inventoryId = parseInt(id);
    const deleteImageId = parseInt(imageId);

    return this.invService.deleteImage(inventoryId, deleteImageId);
  }
}
