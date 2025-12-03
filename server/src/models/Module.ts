import mongoose, { Document, Schema } from "mongoose"

export interface IModule extends Document {
  code: string
  title: string
}

const ModuleSchema = new Schema<IModule>({
  code: String,
  title: String,
})

export default mongoose.model<IModule>("Module", ModuleSchema)
