import { User } from "./User";

export class UserParams {
    minAge = 15;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    gender: 'male' | 'female';
    orderBy = 'lastActive';

    /**
     *
     */
    constructor({gender}: User) {
       this.gender = gender === 'female' ? 'male' : 'female';
        
    }
}
