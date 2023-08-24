import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  weatherForm: FormGroup;
  city: any = 'Groningen';
  temperature: any;
  feelLike: any;
  icon: string = 'Mist';

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder
  ) {
    this.weatherForm = this.formBuilder.group({
      city: [''],
    });
  }

  ngOnInit(): void {
    this.weatherService.getWeather(this.city).subscribe((data: any) => {
      data.subscribe((innerData: any) => {
        this.weatherData = innerData;
        this.temperature = Math.round(this.weatherData?.current?.temp);
        this.feelLike = Math.round(this.weatherData?.current?.feels_like);
        this.icon = this.calculateWeatherIcon(this.weatherData);
        console.log('Weather Data:', this.weatherData);
      });
    });
  }

  onSubmit() {
    const input = this.weatherForm.value.city;
    if (input === '') {
      this.city = 'Groningen';
    } else this.city = input;
    this.ngOnInit();
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
    };
    return currentDate.toLocaleDateString('en-US', options);
  }

  weatherIconMapping: { [condition: string]: string } = {
    'Clear': 'wb_sunny',
    'Clouds': 'cloud',
    'broken clouds': 'filter_drama',
    'Drizzle': 'water_drop',
    'Rain': 'water_drop',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'ac_unit',
    'Mist': 'fitbit',
  };

  calculateWeatherIcon(data: any): string {
    const currentCondition = data.current.weather[0].main;
    const sunsetTimestamp = data.current.sunset;

    // Get the current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Check if it's after sunset and the condition is "clear sky"
    if (
      currentTimestamp > sunsetTimestamp &&
      currentCondition === 'clear sky'
    ) {
      this.icon = 'nights_stay';
    } else {
      this.icon = this.weatherIconMapping[currentCondition];
    }
    return this.icon;
  }
}
