import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css'],
})
export class MyFormComponent {
  myForm: FormGroup;
  generatedJson: string = ''; // Variable to store the generated JSON
  showJsonResult: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      text: ['', Validators.required],
      number: ['', Validators.required],
      date: ['', Validators.required],
      hiddenField: ['hello there'],
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const textControl = this.myForm.get('text');
      const numberControl = this.myForm.get('number');
      const dateControl = this.myForm.get('date');
      const hiddenControl = this.myForm.get('hiddenField');

      if (textControl && numberControl && dateControl) {
        const formData = {
          text: textControl?.value,
          number: numberControl?.value,
          date: dateControl?.value,
          hidden: hiddenControl?.value,
        };

        // Calculate the MD5 hash based on the 'text' field
        const md5Hash = CryptoJS.MD5(formData.text).toString(CryptoJS.enc.Hex);

        // Add the MD5 hash to the JSON object
        const jsonWithHash = {
          ...formData,
          md5Hash: md5Hash,
        };

        // Convert the JSON object to a JSON string
        this.generatedJson = JSON.stringify(jsonWithHash, null, 2); // Using 2 for pretty printing
        this.showJsonResult = true;
      }
    } else {
      this.generatedJson = 'submited';
      this.showJsonResult = false; // Hide JSON result if form is not valid
    }

    console.log('Form data is ', this.myForm.value);
  }
}
