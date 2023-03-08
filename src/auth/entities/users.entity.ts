import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', { unique: true })
  email: string;

  @ApiProperty()
  @Column('text', {
    //INFO: property to hide fields when retrieve information from database
    select: false,
  })
  password: string;

  @ApiProperty()
  @Column('text')
  fullName: string;

  @ApiProperty()
  @Column('boolean', { default: true })
  isActive: boolean;

  @ApiProperty()
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @ApiProperty()
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  validateFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  validateFieldBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
