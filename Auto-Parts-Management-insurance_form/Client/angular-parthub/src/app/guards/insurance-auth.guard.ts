import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { InsuranceService } from '../_services/insurance.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceAuthGuard implements CanActivate {
  
  constructor(
    private insuranceService: InsuranceService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Extract route parameters
    const companyCode = route.paramMap.get('companyCode');
    const publicUuid = route.paramMap.get('publicUuid');
    
    // Check if required parameters are present
    if (!companyCode || !publicUuid) {
      console.error('Missing required route parameters for insurance access');
      return false;
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(companyCode) || !uuidRegex.test(publicUuid)) {
      console.error('Invalid UUID format in route parameters');
      return false;
    }
    
    // Check if company is valid (basic validation)
    return this.insuranceService.isCompanyValid(companyCode).pipe(
      map(isValid => {
        if (isValid) {
          return true; // Allow access to the route
        } else {
          console.error('Invalid company code');
          return false;
        }
      }),
      catchError(error => {
        console.error('Error validating company:', error);
        return of(false);
      })
    );
  }
  
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
