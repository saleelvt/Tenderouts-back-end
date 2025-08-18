import { ObjectId } from "mongoose";

export interface AdminAddCategoryAndPrice {
    _id:ObjectId;
    categoryType?:string;
    Adult:string;
    child:string;
    price:string;
}
