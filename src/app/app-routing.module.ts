import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './components/info/info.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  {path: 'home', component: InfoComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: 'home'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
