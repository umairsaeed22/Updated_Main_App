export const mockUser = {
  UserID: '147625182489547852587523',
  UserName: '3134',
  FirstName: 'Ahmed',
  LastName: 'Adnan',
  EmployeeInfo: {
    Location: 'Riyadh',
    Department: 'Sales',
  },
  AccessRoles: 'Admin',
  Apps: [
    {
      AppID: 'incentive-app',
      Description: 'SalesmanIncentive',

      Role: {
        roleID: 'xxxxxx',
        roleName: 'salesperson',
      },

      Module: [
        {
          ModuleID: 'changeDepartment',
          ModuleDescription: 'change department',
          Access: [
            {
              FullAccess: '1',
              ReadOnlyOrViewOnly: '0',
              Hidden: '0',
            },
          ],
        },
        {
          ModuleID: 'ViewReports',
          ModuleDescription: 'View Reports',
          Access: [
            {
              FullAccess: '0',
              ReadOnlyOrViewOnly: '1',
              Hidden: '0',
            },
          ],
        },
      ],
    },
    {
      AppID: 'mobile-serial-app',
      Description: 'Mobile Serial Maintenance',

      Role: {
        roleID: 'xxxxxx',
        roleName: 'operationManager',
      },

      Module: [
        {
          ModuleID: 'operationManager',
          ModuleDescription: 'Scan Serial Number',
          Access: [
            {
              FullAccess: '1',
              ReadOnlyOrViewOnly: '0',
              Hidden: '0',
            },
          ],
        },
      ],
    },
    {
      AppID: 'userManagement-app',
      Description: 'User management',

      Role: {
        roleID: 'xxxxxx',
        roleName: 'iT_manager',
      },

      Module: [
        {
          ModuleID: 'ScanSerial',
          ModuleDescription: 'Scan Serial Number',
          Access: [
            {
              FullAccess: '1',
              ReadOnlyOrViewOnly: '0',
              Hidden: '0',
            },
          ],
        },
      ],
    },
  ],
};
