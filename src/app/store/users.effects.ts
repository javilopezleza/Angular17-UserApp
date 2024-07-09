import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../services/user.service";
import { catchError, EMPTY, exhaustMap, map, of, tap } from "rxjs";
import { add, addSuccess, findAllPageable, load, remove, removeSuccess, setErrors, update, updateSuccess } from "./users.actions";
import { User } from "../models/user";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable()
export class UsersEffects {

    loadUsers$ = createEffect(
        () => this.actions$.pipe(
            ofType(load),
            exhaustMap(action => this.service.findAllPageable(action.page)
                .pipe(
                    map(pageable => {
                        const users = pageable.content as User[];
                        const paginator = pageable;

                        return findAllPageable({ users, paginator });
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    );

    addUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(add),
            exhaustMap(action => this.service.create(action.userNew)
                .pipe(
                    map(userNew => addSuccess({ userNew })),
                    catchError(error => (error.status == 400) ? of(setErrors({ errors: error.error })) : EMPTY
                    )
                )
            )
        )
    );

    updateUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(update),
            exhaustMap(action => this.service.update(action.userUpdated)
                .pipe(
                    map(userUpdated => updateSuccess({ userUpdated })),
                    catchError(error => (error.status == 400) ? of(setErrors({ errors: error.error })) : EMPTY
                    )
                )
            )
        )
    );

    removeUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(remove),
            exhaustMap(action => this.service.delete(action.id)
                .pipe(
                    map(id => removeSuccess({ id })),
                    catchError(error => (error.status == 400) ? of(setErrors({ errors: error.error })) : EMPTY
                    )
                )
            )
        )
    );

    addSuccessUser$ = createEffect(() => this.actions$.pipe(
        ofType(addSuccess),
        tap(() => {
            this.router.navigate(['/users']);

            Swal.fire({
                title: "Usuario Creado",
                text: "El usuario ha sido creado con éxito",
                icon: "success"
            });
        })
    ), { dispatch: false })

    updateSuccessUser$ = createEffect(() => this.actions$.pipe(
        ofType(updateSuccess),
        tap(() => {
            this.router.navigate(['/users']);

            Swal.fire({
                title: "Usuario Actualizado",
                text: "El usuario ha sido actualizado con éxito",
                icon: "success"
            });
        })
    ), { dispatch: false })

    removeSuccessUser$ = createEffect(() => this.actions$.pipe(
        ofType(removeSuccess),
        tap(() => {
            this.router.navigate(['/users']);
            Swal.fire({
                title: "Eliminado!",
                text: "El usuario ha sido eliminado.",
                icon: "success"
              });
        })
    ), { dispatch: false })

    constructor(
        private router: Router,
        private actions$: Actions,
        private service: UserService
    ) { }

}