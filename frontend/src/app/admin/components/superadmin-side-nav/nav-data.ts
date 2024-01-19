import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faWarehouse, faDollyFlatbed, faTruckLoading, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faCalendarTimes, faUsersCog, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt, faFileContract } from '@fortawesome/free-solid-svg-icons';

export const navbarData = [

    {
        routeLink: '/admin/dashboard',
        icon: faHome,
        label: 'Dashboard'
    },
    {
        routeLink: '/admin/list',
        icon: faUsersCog,
        label: 'Admins'
    },
    {
        routeLink: '/admin/add-new-admin',
        icon: faUserPlus,
        label: 'Add new Admin'
    },
];

export const staffNavbarData = [

    {
        routeLink: '/admin/employees/list',
        icon: faUsers,
        label: 'employee List'
    },
    {
        routeLink: '/admin/employees/leave',
        icon: faCalendarTimes,
        label: 'Leave'
    },
    {
        routeLink: '/admin/employees/add-new-employee',
        icon: faUserPlus,
        label: 'Add new Employee'
    },
];

export const inventoryNavbarData = [

    {
        routeLink: '/admin/inventory/list',
        icon: faWarehouse,
        label: 'Inventory'
    },
    {
        routeLink: '/admin/inventory/process',
        icon: faDollyFlatbed,
        label: 'Processes'
    },
    {
        routeLink: '/admin/inventory/add',
        icon: faTruckLoading,
        label: 'Add Item'
    },
    {
        routeLink: '/admin/inventory/record',
        icon: faFolderOpen,
        label: 'Record'
    }

];

export const engineeringNavbarData = [

    {
        routeLink: '/admin/engineering/work-flow/list',
        icon: faFileAlt,
        label: 'Work Flow'
    },
    {
        routeLink: '/admin/engineering/work-flow/add',
        icon: faFileContract,
        label: 'New Work Flow'
    }

];