import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessMgmt } from './access-mgmt';

describe('AccessMgmt', () => {
  let component: AccessMgmt;
  let fixture: ComponentFixture<AccessMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessMgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessMgmt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
