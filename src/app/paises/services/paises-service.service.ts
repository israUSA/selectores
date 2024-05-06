import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesServiceService {
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];
  private urlBase: string = 'https://restcountries.com/v3.1/';

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    return this.http.get<PaisSmall[]>(`${this.urlBase}region/${region}`);
  }

  getPaisPorCodigo(codigoPais: string): Observable<PaisSmall | null> {
    if (!codigoPais) {
      return of(null);
    }

    console.log('Pasando q no hay papi');
    return this.http.get<PaisSmall>(`${this.urlBase}alpha/${codigoPais}`);
  }

  getPaisPorCodigoSmall(codigoPais: string): Observable<PaisSmall> {
    return this.http.get<PaisSmall>(
      `${this.urlBase}alpha/${codigoPais}?fields=name,cca3`
    );
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      console.log('Los bordes son 1: ',borders);
      return of([]);
    }

    console.log('Los bordes son 2: ',borders);
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
