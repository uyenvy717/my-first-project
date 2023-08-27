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
  usingDate: any;
  city: any = 'Groningen';
  x: any = 0;
  temperature: any;
  feelLike: any;
  icon: string = 'Mist';
  wind: any;
  humidity: any;
  isButtonDisabled: boolean = true;
  isButtonDisabled2: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder
  ) {
    this.weatherForm = this.formBuilder.group({
      city: [''],
    });

    this.getCurrentDate();
  }

  ngOnInit(): void {
    this.weatherService.getWeather(this.city).subscribe((data: any) => {
      this.weatherData = data;
      this.changeData();
      console.log('Weather Data:', this.weatherData);
    });
  }

  onSubmit() {
    const input = this.weatherForm.value.city;
    if (input === '') {
      this.city = 'Groningen';
    } else this.city = input;
    this.ngOnInit();
  }

  getCurrentDate(): void {
    const date = new Date();
    this.usingDate = date;
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  }

  weatherIconMapping: { [condition: string]: string } = {
    Clear: 'wb_sunny',
    Clouds: 'cloud',
    'broken clouds': 'filter_drama',
    Drizzle: 'water_drop',
    Rain: 'water_drop',
    Thunderstorm: 'thunderstorm',
    Snow: 'ac_unit',
    Mist: 'fitbit',
  };

  calculateWeatherIcon(data: any): string {
    const currentCondition = data.main;
    this.icon = this.weatherIconMapping[currentCondition];

    return this.icon;
  }

  selectBeforeDate() {
    const currentDate = new Date();
    if (this.usingDate.getDate() === currentDate.getDate() + 2) {
      this.x = this.x - 1;
      this.usingDate.setDate(currentDate.getDate() + 1);
      this.isButtonDisabled2 = false;
    } else {
      this.x = this.x - 1;
      this.usingDate.setDate(currentDate.getDate());
      this.isButtonDisabled = true;
    }
    this.changeData();
  }

  selectNextDate() {
    const currentDate = new Date();
    if (this.usingDate.getDate() === currentDate.getDate()) {
      this.x = this.x + 1;
      this.usingDate.setDate(currentDate.getDate() + 1);
      this.isButtonDisabled = false;
    } else {
      this.x = this.x + 1;
      this.usingDate.setDate(currentDate.getDate() + 2);
      this.isButtonDisabled2 = true;
    }
    this.changeData();
  }

  changeData(): void {
    this.temperature = Math.round(this.weatherData[this.x]?.temp);
    this.feelLike = Math.round(this.weatherData[this.x]?.feels_like);
    this.icon = this.calculateWeatherIcon(this.weatherData[this.x]);
    this.wind = this.weatherData[this.x]?.wind_speed;
    this.humidity = this.weatherData[this.x]?.humidity;
  }
}
