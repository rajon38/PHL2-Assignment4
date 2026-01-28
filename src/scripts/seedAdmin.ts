import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
    try {
        const seedAdminData = {
            email: "admin1@gmail.com",
            name: "Admin",
            role: UserRole.ADMIN,
            password: "admin123"
        }
        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: seedAdminData.email }
        });
        if (existingAdmin) {
            throw new Error("Admin user already exists");
        }

        // Create admin user
        const signUpAdmin = await fetch("http://localhost:5007/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(seedAdminData),
        });

        if (!signUpAdmin.ok) {
            throw new Error("Failed to create admin user");
        }
        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: { email: seedAdminData.email },
                data: { emailVerified: true }
            });
        }
    } catch (error) {
        console.log(error);
    }
}
seedAdmin();