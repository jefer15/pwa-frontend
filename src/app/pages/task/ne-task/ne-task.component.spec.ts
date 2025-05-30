import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeTaskComponent } from './ne-task.component';

describe('NeTaskComponent', () => {
  let component: NeTaskComponent;
  let fixture: ComponentFixture<NeTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
