import { Column, Entity, Generated, PrimaryColumn } from "typeorm";
import { UserTypeEnum } from "../enums/user_type.enum";
import { nanoid } from "nanoid";

@Entity()
export class Measure {

  @PrimaryColumn()
  @Generated("uuid")
  id: string; //uuid
  @Column({ type: 'timestamp'})
  measure_datetime: Date;
  @Column({
    // type: "simple-enum",
    
    type: "enum",
    enum: UserTypeEnum,
  })
  measure_type: UserTypeEnum
  @Column({ default: false })
  has_confirmed: boolean;
  @Column()
  image_url: string;
  @Column()
  image: string;
  @Column()
  measure_value: number;



  @Column()
  customer_code: string; //uuid


  constructor(props: {
    measure_datetime: Date,
    measure_type: UserTypeEnum,
    has_confirmed?: boolean,
    image: string,
    customer_code: string;
    measure_value: number;
  },
    id?: string, //uuid
  ){
    const image_url = nanoid(5);

    Object.assign(this, props);
    this.image_url = image_url;
    this.id = id ?? crypto.randomUUID().toString();
  }
}
