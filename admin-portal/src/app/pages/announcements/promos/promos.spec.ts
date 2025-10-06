import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Promos } from './promos';

describe('Promos', () => {
  let component: Promos;
  let fixture: ComponentFixture<Promos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Promos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
