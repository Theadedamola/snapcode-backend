import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
  DocumentType,
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Types } from 'mongoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v
        return ret
      },
      virtuals: true,
    },
  },
})
export class UserClass extends TimeStamps {
  @prop({ required: true, unique: true, index: true })
  public googleId!: string

  @prop({ required: true, unique: true })
  public email!: string

  @prop({ required: true })
  public name!: string

  @prop()
  public avatar?: string

  @prop({ ref: () => 'Snippet', default: [] })
  public snippets?: Ref<'Snippet', Types.ObjectId>[]

  @prop({ ref: () => 'Project', default: [] })
  public projects?: Ref<'Project', Types.ObjectId>[]

  // Method to check if user owns a snippet
  public async ownsSnippet(
    this: DocumentType<UserClass>,
    snippetId: string | Types.ObjectId
  ): Promise<boolean> {
    return (
      this.snippets?.some((id) => id.toString() === snippetId.toString()) ||
      false
    )
  }
}

const User = getModelForClass(UserClass)
export default User
