import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMgmt } from './member-mgmt';

describe('MemberMgmt', () => {
  let component: MemberMgmt;
  let fixture: ComponentFixture<MemberMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberMgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberMgmt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
