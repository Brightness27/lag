import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AdminServicesService } from '../admin-services/admin-services.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminServicesService);
  const router = inject(Router);

  if(adminService.isLoggedIn()) {
    return true;
  }
  else {
    router.navigate(['admin/login']);
    return false;
  }
};
