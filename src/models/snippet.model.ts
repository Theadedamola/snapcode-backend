import { prop, getModelForClass, Ref, modelOptions } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Types } from 'mongoose'
import { UserClass } from './user.model'
import { ProjectClass } from './project.model'

// Define the shadow interface for the snippet
class Shadow {
  @prop({ required: true })
  public x!: number

  @prop({ required: true })
  public y!: number

  @prop({ required: true })
  public blur!: number

  @prop({ required: true })
  public color!: string
}

// Define the padding interface for the snippet
class Padding {
  @prop({ required: true })
  public top!: number

  @prop({ required: true })
  public right!: number

  @prop({ required: true })
  public bottom!: number

  @prop({ required: true })
  public left!: number
}

// Define the style interface for the snippet
class SnippetStyle {
  @prop({ enum: ['light', 'dark', 'custom'], required: true })
  public theme!: 'light' | 'dark' | 'custom'

  @prop({ required: true })
  public background!: string

  @prop({ type: () => Padding, _id: false, required: true })
  public padding!: Padding

  @prop({ required: true })
  public borderRadius!: number

  @prop({ type: () => Shadow, _id: false, required: true })
  public shadow!: Shadow

  @prop({ required: true })
  public font!: string

  @prop({ required: true })
  public lineHeight!: number
}

// Define the supported programming languages
enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  HTML = 'html',
}

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
// Define the position interface for the snippet
class Position {
  @prop({ required: true })
  public x!: number

  @prop({ required: true })
  public y!: number
}

// Define the size interface for the snippet
class Size {
  @prop({ required: true })
  public width!: number

  @prop({ required: true })
  public height!: number
}

export class SnippetClass extends TimeStamps {
  @prop({ ref: () => UserClass, required: true, index: true })
  public userId!: Ref<UserClass, Types.ObjectId>

  @prop({ ref: () => ProjectClass, required: true, index: true })
  public projectId!: Ref<ProjectClass, Types.ObjectId>

  @prop({ required: true })
  public title!: string

  @prop({ required: true })
  public code!: string

  @prop({ enum: ProgrammingLanguage, required: true })
  public language!: ProgrammingLanguage

  @prop({ type: () => Position, _id: false, required: true })
  public position!: Position

  @prop({ type: () => Size, _id: false, required: true })
  public size!: Size

  @prop({ type: () => SnippetStyle, _id: false, required: true })
  public style!: SnippetStyle
}

const Snippet = getModelForClass(SnippetClass)
export default Snippet
