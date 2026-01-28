import { auth as betterAuth } from '../lib/auth';
import { Request, Response, NextFunction } from 'express';

export enum UserRole {
    CUSTOMER = "CUSTOMER",
    PROVIDER = "PROVIDER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        if(!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if(!session.user.emailVerified){
            return res.status(403).json({ message: "Please verify your email to access this resource." });
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name as string,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        };

        if(roles.length && !roles.includes(req.user.role as UserRole)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
        }catch(error){
            next(error);
        }
    }
};

export default auth;