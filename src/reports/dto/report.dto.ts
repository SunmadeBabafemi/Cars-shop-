import { Expose, Transform } from "class-transformer";
import { User } from "../../entities/user.entity";

export class ReportDto {
@Expose()
id: Number

@Expose()
price: Number

@Expose()
year: Number

@Expose()
lng: Number

@Expose()
lat: Number

@Expose()
make: string

@Expose()
approved: boolean

@Expose()
model: string

@Expose()
mileage: Number

@Transform(({obj}) => obj.user.id) // this is to expose only the id of the associated user
@Expose()
userId: string


}