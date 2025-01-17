import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UserRole } from '@prisma/client';
import { Store } from '@ngrx/store';
import { UsersActions, UsersSelectors } from './list.state';

@Component({
  selector: 'seed-admin-users-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  vm$ = this.store.select(UsersSelectors.state);

  users$ = this.store.select(UsersSelectors.array);

  constructor(private store: Store) {}

  onPageChange(page: number): void {
    this.store.dispatch(UsersActions.setPage({ page }));
  }

  onRoleChange(role?: UserRole): void {
    this.store.dispatch(UsersActions.patchFilter({ filter: { role } }));
  }
}
