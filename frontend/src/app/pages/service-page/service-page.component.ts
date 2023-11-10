import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.css']
})
export class ServicePageComponent implements OnInit{

  serviceName: string = "";

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

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    if(name) {
      this.serviceName = name;
    }

    this.scrollTo(this.serviceName);

  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({behavior: "smooth"});
  }

}
