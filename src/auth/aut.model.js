import { Schema, model } from "mongoose"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'admin'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

userSchema.methods.toJSON = function(){
    const { password, ...user } = this.toObject()
    return user
}

export default model('User', userSchema)