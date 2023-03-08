import { Product } from './product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty()
  //INFO: autogenerate ids
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('text')
  url: string;

  //INFO: create relation  ManyToOne
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
