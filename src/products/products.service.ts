import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTo } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    //INFO: inject another entity
    @InjectRepository(ProductImage)
    private readonly ProductImageRepository: Repository<ProductImage>,
    //INFO: inject data source for transactional database operation
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.ProductImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  async findAll(paginationDTo: PaginationDTo) {
    const { limit = 10, offset = 0 } = paginationDTo;
    try {
      const products = await this.productRepository.find({
        //INFO: add paginations
        take: limit,
        skip: offset,
        //INFO: add table relations to results
        relations: {
          images: true,
        },
      });
      return products.map((product) => ({
        ...product,
        images: product.images.map((img) => img.url),
      }));
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //INFO: create a query builder
      const query = this.productRepository.createQueryBuilder('product');
      product = await query
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        //INFO: leftJoinAndSelect it is used to make relations between tables
        .leftJoinAndSelect('product.images', 'prodImages')
        .getOne();
    }

    //INFO: set not found exception
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...data } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...data,
      images: [],
    });

    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    //INFO: create a query for Transaction operation
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    //INFO: start database transaction changes
    await queryRunner.startTransaction();

    try {
      if (images?.length) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((image) =>
          this.ProductImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);

      //await this.productRepository.save(product);

      //INFO: apply Database transactions
      await queryRunner.commitTransaction();
      //INFO: release database connection
      await queryRunner.release();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handlerExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return { message: `The Product with id #${id} was deleted` };
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  private handlerExceptions(error) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    //INFO: set internal server exception
    throw new InternalServerErrorException();
  }
}
