import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTo } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  async findAll(paginationDTo: PaginationDTo) {
    const { limit = 10, offset = 0 } = paginationDTo;
    try {
      const products = this.productRepository.find({
        take: limit,
        skip: offset,
      });
      return products;
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
      const query = this.productRepository.createQueryBuilder();
      product = await query
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    //INFO: set not found exception
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException(`Product with ${id} not found`);
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
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

  private handlerExceptions(error) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    //INFO: set internal server exception
    throw new InternalServerErrorException();
  }
}
