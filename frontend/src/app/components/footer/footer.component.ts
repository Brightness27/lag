import { Component } from '@angular/core';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  companyName: string = "L.A. Garcia Electrical Contractor";
  location: string = "3rd Floor, Unit 1, E. L. Dela Cruz Bldg. Costa Verde Subd. Brgy. Tejeros Convention, Rosario, Cavite";
  phoneNumber: string = "(046) 852-2873\t|\t0929-531-9446\t|\t0945-546-7609";
  emailAddress: string = "garcialeonardo1966@gmail.com";
  fbUrl: string = "https://www.facebook.com/lagarciaelectricalcontractor";
  aboutText: string = "L.A. Garcia Electrical Contractor has been an active partner of MERALCO since its inception in July 15, 2015. During that time, its main operation is mostly focused on the installation of Service Entrance and basic house wiring to customers applying for new connection to MERALCO.";

  copyrightText: string = "2023. All rights reserved";

  fbIcon = faFacebook;
  twitterIcon = faTwitter;
  igIcon = faInstagram;

  loc = faMapMarkerAlt;
  phone = faPhone;
  env = faEnvelope;
  
  openInNewTab(url: string) {
    window.open(url, "_blank");
  }
}
