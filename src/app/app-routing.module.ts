import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { HistoricComponent } from './pages/historic/historic.component';
import { MystoreComponent } from './pages/mystore/mystore.component';
import { CreatestoreComponent } from './pages/createstore/createstore.component';
import { CreateproductComponent } from './pages/createproduct/createproduct.component';
import { UpdateproductComponent } from './pages/updateproduct/updateproduct.component';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'store/:id', component: StoreComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'historic', component: HistoricComponent },
  { path: 'mystore', component: MystoreComponent },
  { path: 'createstore', component: CreatestoreComponent },
  { path: 'createproduct', component: CreateproductComponent },
  { path: 'updateproduct/:id', component: UpdateproductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      const lastUrl = localStorage.getItem('lastUrl');

      if (event instanceof NavigationEnd) {
        if (event.url !== '/login' && event.url !== '/register' && lastUrl) {
          localStorage.removeItem('lastUrl');
          window.location.reload();
        }
      }
    });
  }
}
