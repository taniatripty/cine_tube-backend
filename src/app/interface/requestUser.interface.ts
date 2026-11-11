import { UserRole } from "../../generated/prisma/enums"


export interface IRequest{
    userId:string,
    role:UserRole,
    email:string
   
}