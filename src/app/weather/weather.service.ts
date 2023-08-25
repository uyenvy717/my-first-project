import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '590b8d25e716a15331a573f5b45cbac2';
  private apiUrl = 'https://api.openweathermap.org/data/3.0/onecall';

  private cache: Map<string, { data: any, timestamp: number }> = new Map();

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const cachedData = this.cache.get(city);

    if (cachedData) {
      // Check if data is less than 24 hours old (86400000 milliseconds)
      if (Date.now() - cachedData.timestamp < 86400000) {
        return of(cachedData.data);
      }
    }

    // Fetch fresh data if not cached or stale
    return this.fetchWeather(city).pipe(
      catchError(() => {
        // Handle API errors gracefully
        return of(null);
      }),
      map((data) => {
        if (data) {
          // Cache the fetched data with the current timestamp
          this.cache.set(city, { data, timestamp: Date.now() });
        }
        return data;
      })
    );
  }

  fetchWeather(city: string): Observable<any> {
    // Make a request to obtain latitude and longitude
    const geoRequest = this.http.get<any[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`)
      .pipe(
        map(data => data[0]),
        catchError(error => {
          // Handle and log the error, then re-throw it
          console.error('Error fetching location data:', error);
          return throwError(() => error);
        })
      );

    // Combine the latitude and longitude into a single request
    return forkJoin([geoRequest]).pipe(
      map(([location]) => {
        console.log('Geo Location:', location.lat, location.lon, location.name);
        const lat = location?.lat || '';
        const lon = location?.lon || '';

        const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        return this.http.get(url).pipe(
          catchError(error => {
            // Handle and log the error, then re-throw it
            console.error('Error fetching weather data:', error);
            return throwError(() => error);
          })
        );
      }),
      catchError(error => {
        // Handle and log any errors that occur in the switchMap or final result
        console.error('Error in getWeather:', error);
        return throwError(() => error);
      })
    );
  }
}
