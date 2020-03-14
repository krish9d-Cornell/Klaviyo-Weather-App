import { Component } from '@angular/core';
import { EmailService } from '../services/email.service';
import { CommonModule } from '@angular/common';
import {citylist} from '../../data/cities';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent {

  constructor(private emailService: EmailService){}

   cities = citylist.sort()
   email = "";
   location = "";
   submitted = false;
   display_result = "";
   errorMsg  = "";

  onSubmit() {
    this.submitted = true;
    // since this can be a re-submit, clear out the error message
    this.errorMsg = ""
    this.emailService.send_email(this.email,this.location).subscribe(
      (data)=>{
        this.display_result = data["result"];
      },
      (error) => {
        this.errorMsg = error
      }
    );
  }
}
