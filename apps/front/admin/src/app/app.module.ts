import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@afs/front/admin/core';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
