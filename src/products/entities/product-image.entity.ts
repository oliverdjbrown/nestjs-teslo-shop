import { Product } from './product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_images' })
export class ProductImage {
  //INFO: autogenerate ids
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  //INFO: create relation  ManyToOne
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
