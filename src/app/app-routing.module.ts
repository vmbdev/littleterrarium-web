import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

import { SigninComponent } from '@components/user/signin/signin.component';
import { UserEditComponent } from '@components/user/user-edit/user-edit.component';
import { UserLogoutComponent } from '@components/user/user-logout/user-logout.component';
import { UserRegisterComponent } from '@components/user/user-register/user-register.component';

import { LocationComponent } from '@components/location/location/location.component';
import { LocationAddEditComponent } from '@components/location/location-add-edit/location-add-edit.component';
import { LocationListComponent } from '@components/location/location-list/location-list.component';

import { PlantComponent } from './components/plant/plant/plant.component';
import { PlantAddComponent } from '@components/plant/plant-add/plant-add.component';
import { PlantEditComponent } from '@components/plant/plant-edit/plant-edit.component';
import { PlantEditSoilComponent } from '@components/plant/plant-edit-soil/plant-edit-soil.component';
import { PlantAllComponent } from '@components/plant/plant-all/plant-all.component';

import { PhotoAddComponent } from '@components/photo/photo-add/photo-add.component';
import { PhotoComponent } from '@components/photo/photo/photo.component';

import { TasksComponent } from '@components/tasks/tasks.component';
import { TerrariumComponent } from '@components/terrarium/terrarium.component';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
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
      { path: 'edit/:plantId', component: PlantEditComponent, canActivate: [AuthGuard] },
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
      { path: ':username', component: TerrariumComponent }
    ]
  },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
