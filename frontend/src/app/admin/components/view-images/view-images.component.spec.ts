import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImagesComponent } from './view-images.component';

describe('ViewImagesComponent', () => {
  let component: ViewImagesComponent;
  let fixture: ComponentFixture<ViewImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewImagesComponent]
    });
    fixture = TestBed.createComponent(ViewImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
