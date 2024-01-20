import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IsoDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('IsoDatePipe value : ', value);
    return value;
  }
}
