import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    settings: {
      anonymous: { type: Boolean, default: true },
      cloudBackup: { type: Boolean, default: true },
      focus: { type: String, default: null },
    },
    cycleSettings: {
      averageCycleLength: { type: Number, default: 28 },
      averagePeriodLength: { type: Number, default: 5 },
      lastPeriodStart: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
