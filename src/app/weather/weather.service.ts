import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '590b8d25e716a15331a573f5b45cbac2';
  private apiUrl = 'https://api.openweathermap.org/data/3.0/onecall';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    // Make a request to obtain latitude and longitude
    const geoRequest = this.http.get<any[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`)
      .pipe(
        map(data => data[0])
      );

    // Combine the latitude and longitude into a single request
    return forkJoin([geoRequest]).pipe(
      map(([location]) => {
        console.log('Geo Location:', location.lat, location.lon, location.name);
        const lat = location?.lat || '';
        const lon = location?.lon || '';

        const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

        return this.http.get(url);
      })
    );
  }

  // getWeather(city: string): Observable<any> {
  //   return this.http.get<any[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`).pipe(
  //     switchMap(data => {
  //       const location = data[0];
  //       const lat = location?.lat || '';
  //       const lon = location?.lon || '';
  //       const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  //       return this.http.get(url);
  //     })
  //   );
  // }
}
