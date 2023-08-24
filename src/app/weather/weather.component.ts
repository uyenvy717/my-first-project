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
        console.log('Weather Data:', this.weatherData);
      });
    });
  }

  onSubmit() {
    const input = this.weatherForm.value.city;
    if (input == '') {
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
}
