import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  //INFO: validate field with match decorator to check regex expression
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //INFO: property to specified custom message for validations
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
  
  @IsString()
  @MinLength(1)
  fullName: string;
}
