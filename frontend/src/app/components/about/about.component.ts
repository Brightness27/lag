import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  aboutText: string = "L.A. Garcia Electrical Contractor has been an active partner of MERALCO since its inception in July 15, 2015. During that time, its main operation is mostly focused on the installation of Service Entrance and basic house wiring to customers applying for new connection to MERALCO.";

  aboutText2: string = 'The early years refined the capabilities of L.A. Garcia Electrical Contractor both in providing efficient, fast serving but also exemplary quaility of workmanship nestled on the technical standards as required by MERALCO. L.A. Garcia Electrical Contractor represents the ideal CERTIFIED BY MERALCO contractor adhering to the mandatory obligation of providing best quality service to all its customers.';

  mission: string = 'Assist in uplifting the lives of people and enjoy the comfort and pleasure of electrification in every community.';

  vision: string = "A reliable partner in nation building who provides assistance to people's acccess to electricity.";
}
