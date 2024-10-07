import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InveDto } from './dto/inve.dto';
import { CategoryDto } from './dto/category.dto';
import { BrandDto } from './dto/brand.dto';

@Injectable()
export class InventoryService {
  constructor(private prismaService: PrismaService) {}
  async getAll() {
    const productes = await this.prismaService.inventory.findFirst();

    console.log(productes);

    if (!productes) return 'No producte';

    return productes.name;
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
}

// {
//   "name": "Clasi",

//   "barcode": "Sam",

//   "category": 1,

//   "brand": 1,

//   "buyingPrice": 4,

//   "sellingPrice": 5,

//   "productUnit": "kilograms",

//   "quantity": 7,

//   "taxType": "taxable",

//   "description": "asdfasdfasdf",

//   "produtType": "Sale"
// }
