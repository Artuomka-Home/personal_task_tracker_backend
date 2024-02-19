import * as bcrypt from 'bcrypt';

export async function getPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function comparePasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
