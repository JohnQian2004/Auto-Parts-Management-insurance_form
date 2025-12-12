# Angular Insurance Components

This document describes the Angular components created for the insurance system, their integration, and usage.

## Components Overview

### 1. InsuranceViewingComponent
**Location**: `Client/angular-parthub/src/app/insurance-viewing/`

**Purpose**: Provides a secure interface for insurance companies to view vehicle claims and documents without requiring full system authentication.

**Features**:
- Route-based access with company code and public UUID parameters
- Access key authentication form
- Vehicle information display
- Insurance claims listing with status updates
- Document management (upload, download, delete, reorder)
- Responsive design with Bootstrap styling

**Key Files**:
- `insurance-viewing.component.ts` - Component logic and API integration
- `insurance-viewing.component.html` - HTML template
- `insurance-viewing.component.scss` - Styling

**Route**: `/insurance/:companyCode/:publicUuid`

### 2. InsuranceManagementComponent
**Location**: `Client/angular-parthub/src/app/insurance-management/`

**Purpose**: Administrative interface for managing insurance companies, including token generation and management.

**Features**:
- Create, edit, and delete insurance companies
- Generate and regenerate unique tokens
- Copy tokens to clipboard
- Search and filter insurance companies
- Form validation and error handling

**Key Files**:
- `insurance-management.component.ts` - Component logic
- `insurance-management.component.html` - HTML template
- `insurance-management.component.scss` - Styling

**Route**: `/insurance-management` (requires authentication)

### 3. InsuranceCompaniesComponent
**Location**: `Client/angular-parthub/src/app/insurance-companies/`

**Purpose**: Lists and manages existing insurance companies (existing component, updated for integration).

**Route**: `/insurance-companies` (requires authentication)

## Guards and Security

### InsuranceAuthGuard
**Location**: `Client/angular-parthub/src/app/guards/insurance-auth.guard.ts`

**Purpose**: Protects insurance viewing routes by validating company codes and UUIDs before allowing access.

**Features**:
- Extracts route parameters (`companyCode`, `publicUuid`)
- Validates UUID format
- Checks company validity via `InsuranceService.isCompanyValid()`
- Redirects invalid requests

### AuthGuard
**Location**: `Client/angular-parthub/src/app/guards/auth.guard.ts`

**Purpose**: Protects authenticated routes by checking user login status.

**Features**:
- Verifies user authentication via `AuthService.isLoggedIn()`
- Redirects unauthenticated users to login page

## Services

### InsuranceService
**Location**: `Client/angular-parthub/src/app/_services/insurance.service.ts`

**Purpose**: Handles all insurance-related API communications.

**Key Methods**:
- `getClaimView()` - Retrieves claim and document data
- `uploadDocument()` - Uploads new documents
- `downloadDocument()` - Downloads documents
- `updateClaimStatus()` - Updates claim status
- `validateAccess()` - Validates access credentials

### InsurancerService
**Location**: `Client/angular-parthub/src/app/_services/insurancer.service.ts`

**Purpose**: Manages insurance company entities.

**Key Methods**:
- `createInsurancer()` - Creates new insurance companies
- `updateInsurancer()` - Updates existing companies
- `generateUniqueToken()` - Generates unique tokens
- `searchInsurancers()` - Searches and filters companies

### AuthService
**Location**: `Client/angular-parthub/src/app/_services/auth.service.ts`

**Purpose**: Handles user authentication and session management.

**Key Methods**:
- `login()` - User authentication
- `logout()` - User logout
- `isLoggedIn()` - Check authentication status
- `hasRole()` - Check user roles

## Interceptors

### AuthInterceptor
**Location**: `Client/angular-parthub/src/app/interceptors/auth.interceptor.ts`

**Purpose**: Automatically adds authentication headers to HTTP requests and handles 401 responses.

**Features**:
- Adds `Authorization: Bearer {token}` header to authenticated requests
- Redirects to login on 401 responses
- Integrates with `AuthService` for token management

## Routing Configuration

**File**: `Client/angular-parthub/src/app/app-routing.module.ts`

**Routes**:
```typescript
// Insurance routes
{ 
  path: 'insurance/:companyCode/:publicUuid', 
  component: InsuranceViewingComponent,
  canActivate: [InsuranceAuthGuard]
},
{ 
  path: 'insurance-management', 
  component: InsuranceManagementComponent,
  canActivate: [AuthGuard]
},
{ 
  path: 'insurance-companies', 
  component: InsuranceCompaniesComponent,
  canActivate: [AuthGuard]
}
```

## Module Integration

**File**: `Client/angular-parthub/src/app/app.module.ts`

**Updates**:
- Declares new insurance components
- Imports required modules (`ReactiveFormsModule`, `RouterModule`, `BrowserAnimationsModule`)
- Provides services and guards
- Configures HTTP interceptor

## Usage Examples

### Accessing Insurance View
```
https://yourdomain.com/insurance/ABC123/550e8400-e29b-41d4-a716-446655440000
```

### Managing Insurance Companies
```
https://yourdomain.com/insurance-management
```

## Security Features

1. **Route Protection**: Guards prevent unauthorized access
2. **Token Validation**: Insurance routes validate company tokens
3. **UUID Validation**: Ensures proper format for public UUIDs
4. **Authentication Headers**: Automatic token inclusion in API requests
5. **Session Management**: Secure token storage and cleanup

## Dependencies

- **Angular**: Core framework
- **Bootstrap**: UI styling and components
- **Font Awesome**: Icons
- **RxJS**: Reactive programming
- **Angular Forms**: Form handling and validation

## Development Notes

- Components use Angular lifecycle hooks (`OnInit`, `OnDestroy`)
- Reactive forms for user input and validation
- Subject-based cleanup for subscriptions
- Error handling with user-friendly messages
- Responsive design for mobile and desktop
- Print-friendly styles for document viewing

## Testing Considerations

- Unit tests for component logic
- Integration tests for service interactions
- E2E tests for user workflows
- Mock services for isolated testing
- Route testing for guards

## Future Enhancements

- Real-time updates via WebSocket
- Advanced document preview
- Bulk operations for documents
- Enhanced search and filtering
- Mobile app integration
- Offline capability
- Multi-language support
