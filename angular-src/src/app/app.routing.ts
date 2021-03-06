// Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { BlogHomeComponent } from './components/blog/blog-home/blog-home.component';
import { ErrorPageComponent } from './components/errors/error-page/error-page.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';
import { BlogComponent } from './components/blog/blog.component';
import { AddPostComponent } from './components/admin/add-post/add-post.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { EditPostsComponent } from './components/admin/edit-posts/edit-posts.component';
import { AddCategoryComponent } from './components/admin/add-category/add-category.component';
import { EditCategoriesComponent } from './components/admin/edit-categories/edit-categories.component';
import { BlogPostDetailsComponent } from './components/blog/blog-post-details/blog-post-details.component';
import { BlogCategoryListComponent } from './components/blog/blog-category-list/blog-category-list.component';
import { BlogPostsComponent } from './components/blog/blog-posts/blog-posts.component';

// Guards
import { AuthGuard } from './guards/auth/auth.guard';

// Routes
const appRoutes: Routes = [
  {
    path: '', component: BlogComponent, data: { title: 'Blog - Home Page' }, children: [
      {
        path: '', component: BlogHomeComponent
      },
      {
        path: 'posts', component: BlogPostsComponent, data: { title: 'Posts' }
      },
      {
        path: 'posts/:slug', component: BlogPostDetailsComponent
      },
      {
        path: 'categories', component: BlogCategoryListComponent, data: { title: 'Categories' }
      },
      {
        path: 'categories/:slug', component: BlogHomeComponent
      },
      {
        path: 'tags/:tag', component: BlogHomeComponent
      }
    ]
  },
  { path: 'admin', component: AdminComponent, canActivateChild: [AuthGuard], data: { title: 'Admin - Home Page' }, children: [
      {
        path: '', component: AdminHomeComponent
      },
      {
        path: 'add-post', component: AddPostComponent, data: { title: 'Add Post' }
      },
      {
        path: 'edit-posts', component: EditPostsComponent, data: { title: 'Edit Post' }
      },
      {
        path: 'add-category', component: AddCategoryComponent, data: { title: 'Add Category' }
      },
      {
        path: 'edit-categories', component: EditCategoriesComponent, data: { title: 'Edit Categories' }
      },
      {
        path:  '', redirectTo: '', pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin/login', component: LoginFormComponent, data: { title: 'Login' }
  },
  {
    path:  '', redirectTo: '', pathMatch: 'full'
  },
  {
    path: '**', component: ErrorPageComponent
  }
];

const appRouter: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [
    appRouter
  ]
})
export class RoutingModule { }
