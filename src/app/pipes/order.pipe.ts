import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'order'
})
export class OrderPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return [...items].sort((a, b) => a.tipo === 'ingreso' ? -1 : 1);
  }

}
