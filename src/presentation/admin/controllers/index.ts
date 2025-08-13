import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { loginAdminController } from "./adminLogin";
import { adminAddPackageController } from "./adminAddPackage";
import { adminAddDayWisePackageController } from "./adminAddDayDetailedPackage";

export const adminController = (dependencies: IAdminDependencies) => {
    return {
        loginAdmin: loginAdminController(dependencies), // No change needed here.
        adminAddPackage:adminAddPackageController(dependencies),
        adminAddDayDetailedPackage:adminAddDayWisePackageController(dependencies),
    };
};
