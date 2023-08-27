import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8080/api/weather/';

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
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        // Handle and log the error, then re-throw it
        console.error('Error fetching weather data:', error);
        return throwError(() => error);
      })
    );
  }
}
