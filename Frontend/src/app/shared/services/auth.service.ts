import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, RedirectRequest } from '@azure/msal-browser';
import { Subject} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  profile = new Subject<any>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
  }

  login() {

    this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
  }

  logout() {
    this.authService.logoutRedirect();
  }

  getProfile() {
    return this.httpClient
      .get<any>(`${environment.msalConfig.graphEndpoint}`)
      .subscribe((profile: any) => {
        this.profile.next(profile);
      });
  }

  authenticated(): boolean {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
