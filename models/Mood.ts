import mongoose , {Document,Schema} from "mongoose";

export interface IMood extends Document {
    userId: mongoose.Types.ObjectId;
    score : number;
    note ? : string;
    timestamp : Date;
    createdAt : Date;
    updatedAt : Date;
}


const MoodSchema = new Schema<IMood>({
    userId : {type : Schema.Types.ObjectId , required : true},
    score : {type : Number , required : true , min : 0 , max : 100},
    note : {type : String},
    timestamp : {type : Date , default : Date.now}
},{timestamps : true})

MoodSchema.index({userId : 1 , timestamp : -1})

export const Mood = mongoose.models.Mood || mongoose.model<IMood>("Mood",MoodSchema)