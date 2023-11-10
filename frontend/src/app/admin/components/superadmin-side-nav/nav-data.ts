import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { faHeadSideCough, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';

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
        icon: faHeadSideCough,
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
        routeLink: '/admin/inventory',
        icon: faClipboardList,
        label: 'Inventory'
    }

];