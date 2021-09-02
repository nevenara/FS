const crypto = require('crypto');

export class Hashing{
    public static hashPassword(password: string): string {
        let hash = crypto.createHash("sha256").update(password).digest("hex");
        return hash;
    }
}