import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { MyFormComponent } from './my-form/my-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/weather', pathMatch: 'full' }, // Redirect to the Weather component by default
  { path: 'weather', component: WeatherComponent },
  { path: 'my-form', component: MyFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
