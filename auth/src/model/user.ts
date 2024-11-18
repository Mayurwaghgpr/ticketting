import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new User
interface UserAtters {
  email: String;
  password: String;
}

// An interface that describes the properties
// that a User Model has
interface userModel extends mongoose.Model<userDoc> {
  build(attrs: UserAtters): userDoc;
}

// An interface that describes the properties
// that a User Document has
interface userDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAtters) => {
  return new User(attrs);
};

const User = mongoose.model<userDoc, userModel>("User", userSchema);
export { User };
