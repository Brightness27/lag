import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  quote: string = '\"We value integrity, passion for excellence, teamwork, and harmonious relations as fundamental principles in conducting our services that delivers customer satisfaction.\"';

  images = [
    {
      imgSrc: '/assets/LAG LOGO.png',
      imgAlt: 'logo'
    },
    {
      imgSrc: '/assets/1.png',
      imgAlt: 'service'
    },
    {
      imgSrc: '/assets/2.png',
      imgAlt: 'untitled'
    },
    {
      imgSrc: '/assets/3.png',
      imgAlt: 'yyyyy'
    }
  ];

}
