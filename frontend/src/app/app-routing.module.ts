import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesListComponent } from './files-list/files-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'files' },
  { path: 'files', component: FilesListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
