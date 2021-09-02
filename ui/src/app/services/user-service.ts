import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { IUserContext } from '../services/models/user-context';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private authService: AuthenticationService) { }

    public getUserContext(): Promise<IUserContext> {
        return new Promise((resolve, reject) => {
            this.authService.getUserContext().subscribe(res => {
                console.log(`User Context ${JSON.stringify(res)}`);
                resolve(res);
            }, err => {
                reject(err);
            })
        });
    }
}