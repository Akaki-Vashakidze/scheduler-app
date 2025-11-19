export interface User {
    _id: string;
    record:Record;
    email:string;
    isContact:boolean;
}

export interface Record {
    isDeleted:boolean;
    createdAt: string;
    state:number;
}

export interface Invitation {
    _id: string,
    invitee: string,
    weekday: string,
    inviter: string,
    duration: number,
    title: string,
    time: string,
    location: string,
    description: string,
    approved: number,
    urgent: number,
    canceled: number,
    record: Record
}

export interface GenericResponse<T> {
  statusCode: number;
  result: GenericData<T>;
  errors?:string;
}

export interface GenericData<T> {
  data: T;
  page: any;
}

export interface SentContactRequest {
    requester: string,
    contact: {
        _id: string,
        email: string,
        record: Record,
    },
    _id: string,
    createdAt: string,
    updatedAt: string,
}

export interface RecievedContactRequest {
    requester: {
        _id: string,
        email: string,
        record: Record,
    },
    contact: string,
    _id: string,
    createdAt: string,
    updatedAt: string,
}

export interface Contact {
    owner:string,
    contact: User,
    isBlocked:number,
    isFavorite:number,
    _id:string
}