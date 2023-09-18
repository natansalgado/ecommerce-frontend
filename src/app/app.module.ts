import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';

import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './components/header/user/user.component';
import { ProductComponent } from './pages/product/product.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    HeaderComponent,
    UserComponent,
    ProductComponent,
    StoreComponent,
    CartComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
