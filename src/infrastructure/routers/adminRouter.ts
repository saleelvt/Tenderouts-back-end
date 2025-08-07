import { adminController } from '@/presentation/admin/controllers';
import { IAdminDependencies } from './../../application/admin/interfaces/IAdminDependencies';
import { Router } from 'express';

export const adminRoutes = (dependencies: IAdminDependencies) => {
    const { loginAdmin,adminAddPackage,adminAddDayDetailedPackage } = adminController(dependencies);
    const router = Router();
    router.route("/login").post(loginAdmin); // No need to change this line.
    router.route("/addPackage").post(adminAddPackage); // No need to change this line.
    router.route("/addDayDetailedPackage").post(adminAddDayDetailedPackage); // No need to change this line.
    return router;
};
