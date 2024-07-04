import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        avatar: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        about: {
            type: String,
        },
    },
    { timestamps: true }
);

//before saving we need to-
//encrypt the password

userSchema.pre("save", (next) => {
    bcrypt
        .hash(this.password, 10)
        .then((hash) => {
            this.password = hash;
        })
        .catch((error) =>
            console.log({
                message: "Error while encypting the password",
                error: error,
            })
        )
        .finally(next());
});

userSchema.methods = {
    isPasswordCorrect: (password) => {
        bcrypt.compare(password, this.password).then((result) => {
            return result;
        });
    },

    generateAccessToken: function () {
        return jwt.sign(
            {
                id: this._id,
                username: this.username,
                email: this.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );
    },

    generateRefreshToken: function () {
        return jwt.sign(
            {
                id: this._id,
                username: this.username,
                email: this.email,
            },
            process.loadEnvFile.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );
    },
};

const User = mongoose.model("User", userSchema);

export default User;
