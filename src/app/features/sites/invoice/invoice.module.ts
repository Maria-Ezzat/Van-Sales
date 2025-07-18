import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
 { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },
{ path: 'details/:id', component: DetailsComponent }
];

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    SharedModule,
    DropdownModule,
    InputSwitchModule,
    RouterModule.forChild(routes)
  ]
})
export class InvoiceModule { }
