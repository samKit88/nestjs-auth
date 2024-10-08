import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InveDto } from './dto/inve.dto';
import { CategoryDto } from './dto/category.dto';
import { BrandDto } from './dto/brand.dto';
import { QueryDto } from './dto/query.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InventoryService {
  constructor(private prismaService: PrismaService) {}

  async getAll(page: number, limit: number, queryDto: QueryDto) {
    const productes = await this.prismaService.inventory.findMany({
      skip: page,
      take: limit,
      where: { name: { contains: queryDto.search } },
      orderBy: { [queryDto.sort]: queryDto.order },
    });

    // console.log(productes);

    if (!productes) return 'No producte';

    return productes;
  }

  async getByID(reqId: number) {
    const producte = await this.prismaService.inventory.findUnique({
      where: {
        id: reqId,
      },
    });

    return producte;
  }

  async createNewinv(dto: InveDto, adminEmail) {
    const isAdmin = await this.prismaService.user.findUnique({
      where: {
        email: adminEmail,
        isSuperAdmin: true,
      },
    });

    if (!isAdmin) throw new ForbiddenException('Access Denied');

    const newProducte = await this.prismaService.inventory.create({
      data: {
        name: dto.name,
        userId: isAdmin.id,
        barcode: dto.barcode,
        categoryId: dto.category,
        brandId: dto.brand,
        buyingPrice: dto.buyingPrice,
        sellingPrice: dto.sellingPrice,
        productUnit: dto.productUnit,
        quantity: dto.quantity,
        taxType: dto.taxType,
        description: dto.description,
        produtType: dto.produtType,
      },
    });

    return newProducte;
  }

  async createNewCategory(dto: CategoryDto, adminEmail) {
    const isAdmin = await this.prismaService.user.findUnique({
      where: {
        email: adminEmail,
        isSuperAdmin: true,
      },
    });

    if (!isAdmin) throw new ForbiddenException('Access Denied');

    const checkCategory = await this.prismaService.category.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (checkCategory) throw new ForbiddenException('Category exsist');

    const newCategory = await this.prismaService.category.create({
      data: {
        name: dto.name,
      },
    });

    return newCategory.name;
  }

  async createNewBrand(dto: BrandDto, adminEmail) {
    const isAdmin = await this.prismaService.user.findUnique({
      where: {
        email: adminEmail,
        isSuperAdmin: true,
      },
    });

    if (!isAdmin) throw new ForbiddenException('Access Denied');

    const newBrand = await this.prismaService.brand.create({
      data: {
        name: dto.name,
      },
    });

    return newBrand.name;
  }

  async updateInventory(inventoryId: number, adminEmail, dto: InveDto) {
    const isAdmin = await this.prismaService.user.findUnique({
      where: {
        email: adminEmail,
        isSuperAdmin: true,
      },
    });

    if (!isAdmin) throw new ForbiddenException('Access Denied');

    const checkInventory = await this.prismaService.inventory.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!checkInventory) throw new ForbiddenException('Not found');

    const updatedInve = await this.prismaService.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        name: dto.name,
        userId: isAdmin.id,
        barcode: dto.barcode,
        categoryId: dto.category,
        brandId: dto.brand,
        buyingPrice: dto.buyingPrice,
        sellingPrice: dto.sellingPrice,
        productUnit: dto.productUnit,
        quantity: dto.quantity,
        taxType: dto.taxType,
        description: dto.description,
        produtType: dto.produtType,
      },
    });

    return updatedInve;
  }

  async deleteInventory(inventoryId: number, adminEmail: string) {
    const isAdmin = await this.prismaService.user.findUnique({
      where: {
        email: adminEmail,
        isSuperAdmin: true,
      },
    });

    if (!isAdmin) throw new ForbiddenException('Access Denied');

    const checkInventory = await this.prismaService.inventory.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!checkInventory) throw new ForbiddenException('Not found');

    const deleteInve = await this.prismaService.inventory.delete({
      where: {
        id: inventoryId,
      },
    });

    return deleteInve.name;
  }

  async uploadImage(inventoryId: number, fileUrl: string) {
    const producte = await this.prismaService.inventory.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!producte) throw new ForbiddenException('No Producte');

    const countImage = await this.prismaService.image.count({
      where: {
        imageId: producte.id,
      },
    });

    if (countImage >= 5)
      throw new ForbiddenException('Can not add another image');

    const image = await this.prismaService.image.create({
      data: {
        imageURL: fileUrl,
        imageId: producte.id,
      },
    });

    return `Image saved successfuly! ${image}`;
  }

  async getImageById(inventoryId: number) {
    const producte = await this.prismaService.inventory.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!producte) throw new ForbiddenException('No Producte!!!');

    const producteImages = await this.prismaService.image.findMany({
      where: {
        imageId: producte.id,
      },
    });
    return producteImages;
  }

  async deleteImage(inventoryId: number, deleteImageId: number) {
    const producte = await this.prismaService.inventory.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!producte) throw new ForbiddenException('No Producte');

    const imageDeleted = await this.prismaService.image.delete({
      where: {
        id: deleteImageId,
        imageId: producte.id,
      },
    });

    const filePath = path.join(imageDeleted.imageURL);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(`Error deleting file ${err}`);
      }
    });

    return imageDeleted;
  }
}
