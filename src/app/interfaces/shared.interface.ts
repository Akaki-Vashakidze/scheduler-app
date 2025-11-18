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
}

export interface GenericData<T> {
  data: T;
  page: any;
}

export interface ContactRequest {
    requester: string,
    contact: string,
    _id: string,
    createdAt: string,
    updatedAt: string,
}