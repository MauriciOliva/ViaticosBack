import { hash, verify } from "argon2";

export const encrypt = async (password) => {
    return await hash(password);
}

export const checkPassword = async (hashedPassword, plainPassword) => {
    return await verify(hashedPassword, plainPassword);
}