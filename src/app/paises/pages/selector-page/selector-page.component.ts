import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { delay, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css',
})
export class SelectorPageComponent {
  regiones: string[] = [];
  paisesPorRegiones: PaisSmall[] = [];
  paisesFronteras: PaisSmall [] = []
  cargando: Boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private paisesService: PaisesServiceService
  ) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    /*Cuando cambie la region*/
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(
    //     region => {
    //       console.log(region)
    //       this.paisesService.getPaisesPorRegion(region).subscribe(
    //         {
    //           next: (paises) => {
    //             this.paisesPorRegiones = paises
    //             console.log(this.paisesPorRegiones)
    //           }
    //         }
    //       )
    //     }
    //   )

    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true
          delay(6000)
        }),
        switchMap((region) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe({
        next: (paises) => {
          this.paisesPorRegiones = paises;
          
          this.cargando = false
        },
      });


      /*Cuando cambie el pais*/
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( (_) =>{
          this.paisesFronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true
          delay(6000)
        }
        ),
        switchMap(
          codigo => 
            this.paisesService.getPaisPorCodigo(codigo)      
        ),
        switchMap(
          pais => {
            if (Array.isArray(pais)) {
              console.log('switch bordes: ', pais[0].borders!)
              return this.paisesService.getPaisesPorCodigos(pais[0].borders!);
            } else {
              // Si no es un arreglo, devolver un observable que emite un arreglo vacío
              return of([]);
            }
          }   
        )
      )
      .subscribe(
        {
          next: (paises) => {

            // if(Array.isArray(pais)){
            //   this.paisesFronteras = pais.length > 0 ?  pais[0].borders: null
            // }

            this.paisesFronteras = paises;
             this.cargando = false


        
          }
        }
      )

  }

  miFormulario: FormGroup = this._formBuilder.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['',[Validators.required]]
  });

  guardar = () => {
     this.paisesService
       .getPaisesPorRegion(this.miFormulario.get('region')?.value)
       .subscribe({
         next: (paises) => {
           this.paisesPorRegiones = paises;
           //console.log(this.paisesPorRegiones);
         },
       });
  };
}
