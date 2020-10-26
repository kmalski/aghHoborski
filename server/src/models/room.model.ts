import { prop, getModelForClass } from '@typegoose/typegoose';

export { RoomModel, RoomShared, RoomInternal };

class RoomSchema {
  @prop({ unique: true })
  public name!: string;

  @prop()
  public hash!: string;
}

const RoomModel = getModelForClass(RoomSchema, {
  schemaOptions: { collection: 'rooms' }
});

interface Room {
  name: string;
  token?: string;
}

interface RoomInternal extends Room {
  hash?: string;
}

interface RoomShared extends Room {
  password?: string;
}
