import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
    @IsString()
    make: string

    @IsString()
    model: string

    @Transform(({value}) => parseInt(value) ) // the year when inputed into the 
    //querystring will be treeated as a string. so it needs to be parsed as integer
    //before it can  be validated as a number
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number


    @Transform(({value}) => parseInt(value) ) 
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number

    @Transform(({value}) => parseFloat(value) )  
    @IsLongitude()
    lng: number

    @Transform(({value}) => parseFloat(value) ) 
    @IsLatitude()
    lat: number


}