import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInUIComponent } from './sign-in.component';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { AuthMethods } from '@seed/front/shared/types';

describe(SignInUIComponent.name, () => {
  let component: SignInUIComponent;
  let fixture: ComponentFixture<SignInUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInUIComponent],
    })
      .overrideComponent(SignInUIComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }, // To make fixture.detectChanges() work
      })
      .compileComponents();
    fixture = TestBed.createComponent(SignInUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getSignInButton(method: AuthMethods): DebugElement {
    return fixture.debugElement.query(By.css(`button[data-e2e="${method}"]`));
  }
  function getSignOutButton(): DebugElement {
    return fixture.debugElement.query(By.css(`button[data-e2e="signOut"]`));
  }

  it('shows loading animation when isAuthenticating == true', () => {
    component.isAuthenticating = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Authenticating...');
  });

  it('shows "Welcome back!" message and "Sign out" button when isAuthenticated == true', () => {
    component.isAuthenticated = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Welcome back!');
    expect(getSignOutButton().nativeElement.textContent).toContain('Sign out');
  });

  it('shows "Welcome!" message and "Sign in anonymously" button when isAuthenticated == false', () => {
    component.isAuthenticated = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Welcome!');
    expect(getSignInButton(AuthMethods.anonymous).nativeElement.textContent).toContain('Try app anonymously');
  });

  it('emits "signIn" on "Sign in" button click', done => {
    component.signIn.pipe(first()).subscribe((method: AuthMethods) => {
      expect(method).toEqual(AuthMethods.anonymous);
      done();
    });
    getSignInButton(AuthMethods.anonymous).nativeElement.click();
  });

  it('emits "signOut" on "Sign out" button click', done => {
    component.isAuthenticated = true;
    fixture.detectChanges();
    component.signOut.pipe(first()).subscribe(() => done());
    getSignOutButton().nativeElement.click();
  });
});