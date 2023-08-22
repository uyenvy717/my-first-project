import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'f463a364f75dc7e4e14a2acd9140f058';
  private apiUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

  constructor(private http: HttpClient) {}

  getWeather(): Observable<any> {
    const city = 'Groningen,NL';
    const units = 'metric'; // Celsius
    const url = `${this.apiUrl}?q=${city}&units=${units}&appid=${this.apiKey}`;

    return this.http.get(url);
  }
}
