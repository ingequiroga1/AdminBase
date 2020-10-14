import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpUtilsService,QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Base } from '../_models/bases.model';
import { CustomerModel } from '../../e-commerce/_models/customer.model';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient,
    private httpUtils: HttpUtilsService) {
  }

  // Authentication/Authorization
  // login(email: string, password: string): Observable<User> {
  //   return this.http.post<User>('http://52.226.100.59/api/Client/login', {email, password});
  // }

  login(email: string, password: string): Observable<CustomerModel> {
    // return this.http.post<User>('http://52.226.100.59/api/Client/login', {email, password});
    return this.http.post<CustomerModel>(environment.serverpath + 'Client/login', {email, password});
  }

  getUserByToken(): Observable<User> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    // let httpHeaders = new HttpHeaders();
    // httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userToken);
    // return this.http.get<User>(API_USERS_URL, {headers: httpHeaders});

    return this.http.get<User>(environment.serverpath + 'Client/'+userToken);
  }

  getBasesById(): Observable<Base[]> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    // let httpHeaders = new HttpHeaders();
    // httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userToken);
    // return this.http.get<User>(API_USERS_URL, {headers: httpHeaders});
    return this.http.get<Base[]>(environment.serverpath + 'Base/client/'+userToken);
  }


  register(user: User): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<User>(API_USERS_URL, user, {headers: httpHeaders})
      .pipe(
        map((res: User) => {
          return res;
        }),
        catchError(err => {
          return null;
        })
      );
  }

  /*
   * Submit forgot password request
   *
   * @param {string} email
   * @returns {Observable<any>}
   */
  public requestPassword(email: string): Observable<any> {
    return this.http.get(API_USERS_URL + '/forgot?=' + email)
      .pipe(catchError(this.handleError('forgot-password', []))
      );
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.serverpath + 'User');
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(environment.serverpath + 'User' + `/${userId}`);
  }


  // DELETE => delete the user from the server
  deleteUser(userId: number) {
    const url = `${API_USERS_URL}/${userId}`;
    return this.http.delete(url);
  }

  // UPDATE => PUT: update the user on the server
  // tslint:disable-next-line
  updateUser(_user: User): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_USERS_URL, _user, {headers: httpHeaders});
  }

  // CREATE =>  POST: add a new user to the server
  // createUser(user: User): Observable<User> {
  //   let httpHeaders = new HttpHeaders();
  //   httpHeaders = httpHeaders.set('Content-Type', 'application/json');
  //   debugger;
  //   return this.http.post<User>(environment.serverpath + 'User', user, {headers: httpHeaders});
  // }
  createUser(user: User, image: File): Observable<User> {
    const formData = new FormData();
    formData.append('Userdatastring',JSON.stringify(user));
    formData.append('file',image,image.name);
    debugger;
    return this.http.post<User>('http://localhost:60026/api/User', formData);
  }
  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
  //   let httpHeaders = new HttpHeaders();
  //   httpHeaders = httpHeaders.set('Content-Type', 'application/json');
  //   return this.http.get<QueryResultsModel>('http://52.226.100.59/api/User');
  //   //return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, {headers: httpHeaders});
  // }

  findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    return this.getAllUsers().pipe(
      mergeMap((response: User[]) => {
        const result = this.httpUtils.baseFilter(response, queryParams, []);
        return of(result);
      })
    );
  }

  // Permission
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL);
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
  }

  // Roles
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(API_ROLES_URL);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
  }

  // CREATE =>  POST: add a new role to the server
  createRole(role: Role): Observable<Role> {
    // Note: Add headers if needed (tokens/bearer)
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<Role>(API_ROLES_URL, role, {headers: httpHeaders});
  }

  // UPDATE => PUT: update the role on the server
  updateRole(role: Role): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_ROLES_URL, role, {headers: httpHeaders});
  }

  // DELETE => delete the role from the server
  deleteRole(roleId: number): Observable<Role> {
    const url = `${API_ROLES_URL}/${roleId}`;
    return this.http.delete<Role>(url);
  }

  // Check Role Before deletion
  isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
  }

  findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, {headers: httpHeaders});
  }

  /*
   * Handle Http operation that failed.
   * Let the app continue.
    *
  * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
