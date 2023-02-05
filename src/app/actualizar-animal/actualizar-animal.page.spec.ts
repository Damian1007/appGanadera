import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActualizarAnimalPage } from './actualizar-animal.page';

describe('ActualizarAnimalPage', () => {
  let component: ActualizarAnimalPage;
  let fixture: ComponentFixture<ActualizarAnimalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarAnimalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarAnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
