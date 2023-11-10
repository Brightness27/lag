import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminSideNavComponent } from './superadmin-side-nav.component';

describe('SuperadminSideNavComponent', () => {
  let component: SuperadminSideNavComponent;
  let fixture: ComponentFixture<SuperadminSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminSideNavComponent]
    });
    fixture = TestBed.createComponent(SuperadminSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
