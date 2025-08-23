import { adminController } from '@/presentation/admin/controllers';
import { IAdminDependencies } from './../../application/admin/interfaces/IAdminDependencies';
import { Router } from 'express';

export const adminRoutes = (dependencies: IAdminDependencies) => {
    const { loginAdmin,adminAddPackage,adminAddDayDetailedPackage,deletePackage ,deleteDeatailedPackage,adminGetPackages,adminGetDayDetailedPackage,userGetDataByQuery} = adminController(dependencies);
    const router = Router();
    router.route("/login").post(loginAdmin); // No need to change this line.
    router.route("/addPackage").post(adminAddPackage); // No need to change this line.
    router.route("/getPackages").get(adminGetPackages); // No need to change this line.
    router.route("/deletePackage/:id").delete(deletePackage); // No need to change this line.
    router.route("/addDayDetailedPackage").post(adminAddDayDetailedPackage);
      router.route("/getDetailedPackage").get(adminGetDayDetailedPackage); // No need to change this 
    router.route("/deleteDetailedPackage/:id").delete(deleteDeatailedPackage); 

    //user
    router.route("/userGetDataByQuery").get(userGetDataByQuery);
    return router; 
}
