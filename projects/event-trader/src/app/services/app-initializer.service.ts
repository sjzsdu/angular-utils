import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  initialize(): Promise<void> {
    return new Promise((resolve) => {
      // 在这里添加初始化逻辑
      console.log('App initialization complete');
      resolve();
    });
  }
}
