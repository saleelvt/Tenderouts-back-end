import { AdminEntity } from "@/domain/entities";

import { model,Schema } from "mongoose";

const adminSchema = new Schema<AdminEntity>({

    userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      
    },
    {
        timestamps: true,
      }
     
)


export const Admin=model<AdminEntity>("Admin",adminSchema)