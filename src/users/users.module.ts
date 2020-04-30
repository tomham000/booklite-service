import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { CONNECTION_OPTIONS } from 'config/mongodb/connection-options.config';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI, CONNECTION_OPTIONS),
            MongooseModule.forFeature([
              {name: 'User', schema: UserSchema}
            ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema}
    ])
  ]
})
export class UsersModule {}