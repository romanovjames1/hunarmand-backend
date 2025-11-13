import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;
  @Prop({
    required: true,
  })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
