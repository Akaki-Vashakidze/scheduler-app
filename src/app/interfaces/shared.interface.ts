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
    end: string,
    title: string,
    start: string,
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
  message:[] | any
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

export interface CalendarDay {
    weekday: string,
    date: number,
    month: string,
    fullDate: Date,
    events:Invitation[],
    timeline:any;
}

export interface SelectedSchedule {
    day: string,
    date: Date,
    start?: string | null,
    end?: string | null,
    isChecked?:boolean,
    title:string,
    description:string,
    urgent:number,
    location:string,
    isSingleUse?:number;
}

export interface SendInvitation {
  title: string,
  description: string,
  start: string,
  end: string,
  urgent:number,
  weekday: string,
  invitee: string,
  location:string,
  isSingleUse:number,
  date:Date
}