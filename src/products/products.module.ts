import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //INFO: Import TypeOrm Module specifying entities to be created on database
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  //INFO: export module resources
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
