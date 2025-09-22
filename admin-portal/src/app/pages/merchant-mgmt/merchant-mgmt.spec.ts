import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantMgmt } from './merchant-mgmt';

describe('MerchantMgmt', () => {
  let component: MerchantMgmt;
  let fixture: ComponentFixture<MerchantMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantMgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantMgmt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
