"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const adminLogin_1 = require("./adminLogin");
const adminAddPackage_1 = require("./adminAddPackage");
const adminAddDayDetailedPackage_1 = require("./adminAddDayDetailedPackage");
const deletePackage_1 = require("./deletePackage");
const deleteDetailedPackage_1 = require("./deleteDetailedPackage");
const adminGetPackages_1 = require("./adminGetPackages");
const adminGetDayDetailedPackage_1 = require("./adminGetDayDetailedPackage");
const userGetDataByQueryController_1 = require("./userGetDataByQueryController");
const adminController = (dependencies) => {
    return {
        loginAdmin: (0, adminLogin_1.loginAdminController)(dependencies), // No change needed here.
        adminAddPackage: (0, adminAddPackage_1.adminAddPackageController)(dependencies),
        adminAddDayDetailedPackage: (0, adminAddDayDetailedPackage_1.adminAddDayWisePackageController)(dependencies),
        deletePackage: (0, deletePackage_1.adminDeletePackageController)(dependencies),
        deleteDeatailedPackage: (0, deleteDetailedPackage_1.adminDeleteDetailedPackageController)(dependencies),
        adminGetPackages: (0, adminGetPackages_1.adminGetPackagesController)(dependencies),
        adminGetDayDetailedPackage: (0, adminGetDayDetailedPackage_1.adminGetDetailedPackageController)(dependencies),
        userGetDataByQuery: (0, userGetDataByQueryController_1.userGetDataByQueryController)(dependencies)
    };
};
exports.adminController = adminController;
