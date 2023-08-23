import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  weatherForm = this.formBuilder.group({
    city: [''],
  });
  city: any = 'Groningen';

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.weatherService.getWeather(this.city).subscribe((data: any) => {
      data.subscribe((innerData: any) => {
        this.weatherData = innerData;
        console.log('Weather Data:', this.weatherData);
      });
    });
  }

  onSubmit() {
    const input = this.weatherForm.value.city;
    this.city = input;
    // this.weatherService.getWeather(this.city).subscribe((data: any) => {
    //   this.weatherData = data;
    //   console.log('Weather Data:', this.weatherData);
    // });
    this.ngOnInit();
  }
}
