import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserLogoutComponent } from './user/user-logout/user-logout.component';
import { UserSigninComponent } from './user/user-signin/user-signin.component';
import { LocationComponent } from './location/location/location.component';
import { LocationAddEditComponent } from './location/location-add-edit/location-add-edit.component';
import { LocationListComponent } from './location/location-list/location-list.component';
import { PlantComponent } from './plant/plant/plant.component';
import { PhotoComponent } from './photo/photo/photo.component';
import { PhotoAddComponent } from './photo/photo-add/photo-add.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { PlantAddComponent } from './plant/plant-add/plant-add.component';
import { PlantEditSoilComponent } from './plant/plant-edit-soil/plant-edit-soil.component';
import { PlantAllComponent } from './plant/plant-all/plant-all.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { TasksComponent } from './tasks/tasks/tasks.component';
import { AuthGuard } from './auth/auth.guard';
import { TerrariumComponent } from './terrarium/terrarium/terrarium.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: UserSigninComponent },
  { path: 'logout', component: UserLogoutComponent },
  { path: 'register', component: UserRegisterComponent },
  {
    path: 'user',
    children: [
      { path: 'edit', component: UserEditComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'location',
    children: [
      { path: '', component: LocationListComponent, canActivate: [AuthGuard] },
      { path: 'create', component: LocationAddEditComponent, canActivate: [AuthGuard] },
      { path: 'edit/:locationId', component: LocationAddEditComponent, canActivate: [AuthGuard] },
      { path: ':locationId', component: LocationComponent },
    ]
  },
  {
    path: 'plant',
    children: [
      { path: 'all', component: PlantAllComponent, canActivate: [AuthGuard] },
      { path: 'create/:locationId', component: PlantAddComponent, canActivate: [AuthGuard] },
      { path: 'edit/:plantId', component: PlantAddComponent, canActivate: [AuthGuard] },
      { path: 'edit/:plantId/soil', component: PlantEditSoilComponent, canActivate: [AuthGuard] },
      { path: ':plantId', component: PlantComponent },
    ]
  },
  {
    path: 'photo',
    children: [
      { path: 'create/:plantId', component: PhotoAddComponent, canActivate: [AuthGuard] },
      { path: 'edit/:photoId', component: PhotoAddComponent, canActivate: [AuthGuard] },
      { path: ':photoId', component: PhotoComponent },
    ]
  },
  {
    path: 'terrarium',
    children: [
      { path: '', component: TerrariumComponent }
    ]
  },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
