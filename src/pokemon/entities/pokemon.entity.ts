import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
    type: SchemaTypes.String,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
    type: SchemaTypes.Number,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
