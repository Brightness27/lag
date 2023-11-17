import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProcessComponent } from './inventory-process.component';

describe('InventoryProcessComponent', () => {
  let component: InventoryProcessComponent;
  let fixture: ComponentFixture<InventoryProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryProcessComponent]
    });
    fixture = TestBed.createComponent(InventoryProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
