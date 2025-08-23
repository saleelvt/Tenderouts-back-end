import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { loginAdminController } from "./adminLogin";
import { adminAddPackageController } from "./adminAddPackage";
import { adminAddDayWisePackageController } from "./adminAddDayDetailedPackage";
import { adminDeletePackageController } from "./deletePackage";
import { adminDeleteDetailedPackageController } from "./deleteDetailedPackage";
import { adminGetPackagesController } from "./adminGetPackages";
import { adminGetDetailedPackageController } from "./adminGetDayDetailedPackage";
import { userGetDataByQueryController } from "./userGetDataByQueryController";


export const adminController = (dependencies: IAdminDependencies) => {
    return {
        loginAdmin: loginAdminController(dependencies), // No change needed here.
        adminAddPackage:adminAddPackageController(dependencies),
        adminAddDayDetailedPackage:adminAddDayWisePackageController(dependencies),
        deletePackage:adminDeletePackageController(dependencies),
        deleteDeatailedPackage:adminDeleteDetailedPackageController(dependencies),
        adminGetPackages:adminGetPackagesController(dependencies),
        adminGetDayDetailedPackage:adminGetDetailedPackageController(dependencies),
        userGetDataByQuery:userGetDataByQueryController(dependencies)


    };
};
