import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {
    
    public currentDisplayedLogin = new Subject<string>();
    public updateContactList = new Subject<number>();
} 