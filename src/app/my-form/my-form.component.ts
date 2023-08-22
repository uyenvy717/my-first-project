import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css'],
})
export class MyFormComponent {
  userInput: {
    text: string;
    number: number | null;
    date: string;
  } = {
    text: '',
    number: null,
    date: ''
  };

  generatedJson: string = ''; // Variable to store the generated JSON

  // Function to calculate the MD5 hash using crypto-js
  calculateMD5(text: string): string {
    return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
  }

  onSubmit() {
    // Here, you can access the user's input as userInput.text, userInput.number, and userInput.date
    console.log('Text Field:', this.userInput.text);
    console.log('Number:', this.userInput.number);
    console.log('Date:', this.userInput.date);
    
    // The hidden field's value is always "hello there"
    console.log('Hidden Field:', 'hello there');

    // Create a JSON object with form values
    const formData = {
      text: this.userInput.text,
      number: this.userInput.number,
      date: this.userInput.date
    };

    // Calculate the MD5 hash based on the 'text' field
    const md5Hash = this.calculateMD5(formData.text);

    // Add the MD5 hash to the JSON
    const jsonWithHash = {
      ...formData,
      md5Hash: md5Hash
    };

    // Convert the JSON object with the hash to a JSON string
    this.generatedJson = JSON.stringify(jsonWithHash, null, 2); // Using 2 for pretty printing
  }
}
