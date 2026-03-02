import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StocksComponent } from './stocks.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('StocksComponent (Jasmine/Karma)', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StocksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Глобальная заглушка для Bootstrap
    (window as any).bootstrap = {
      Modal: class { show() {}; hide() {} }
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('ШАГ 5.1: Должен загружать данные о складах через Signals', () => {
    // 1. Инициализируем компонент (ngOnInit вызовет запрос)
    fixture.detectChanges();
    
    // 2. Перехватываем ОДИН запрос
    const req = httpMock.expectOne(r => r.url.includes('/stocks/'));
    expect(req.request.method).toBe('GET');
    
    // 3. Отправляем данные
    req.flush([{ id: 1, nameStock: 'Jasmine_Warehouse_Success' }]);

    // 4. Проверяем сигналы
    expect(component.stocks().length).toBe(1);
    expect(component.stocks()[0].nameStock).toBe('Jasmine_Warehouse_Success');
  });
});
