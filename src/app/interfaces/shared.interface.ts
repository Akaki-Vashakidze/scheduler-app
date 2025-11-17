export interface User {
    _id: string;
    record:Record;
    email:string
}

export interface Record {
    isDeleted:boolean;
    createdAt: string;
    state:number;
}