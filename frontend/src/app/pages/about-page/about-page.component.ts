import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent {
  background: string = 'On July 01, 2014, L.A. Garcia Electrical Contractor was introduced by its C.E.O, Leonardo A. Garcia. The company began its operation in the first office located at Jordan Estates, San Antonio 1, Noveleta, Cavite with just five (5) employees — the chief executive officer himself, his wife, and three other people, with only one vehicle being used for their transportation, the Tamaraw FX.';

  background2: string = "As a starting company offering services responsiblefor the installation, maintenance, and repair of electrical systems, residential homes are their primary target market. But because of the CEO's great resolve and the support of his family and employees, the company became certified by Meralco and started working with extensive clients.";

  background3: string = "In the year 2020, the company relocated to Costa Verde Subd., Brgy. Tejeros Convention, Rosario, Cavite. Started from being a small firm, now it has 62 employees workingfor the oraganization; from one transport vehicle, now there are five existing commercial vehicles (Mitsubishi, L300), and one Montero Sport for company mobility. In addition to residential homes, they currently work with large companies including Antel Grand Village, Duraville Realty and Development Corporation, Raemulan Lands Inc., Queenstown Property Development Corp., and MyCitiHomes. As time progresses, the company aims to diversify its business beyond being an electrical contractor by becoming a land developer as well, with still having the same mission, \"To Give Light and Serve the Community.\"";

  background4: string = "As a contractor, consistently business updates and training program that institutionalizes MERALCO's best practices among energy service providers, contractors, developers, and designers. And since some emlployees are estimator and firsthand contact of MERALCO's clients who are involve in calculating project duration costs, including materials, overhead and labor and all of them somehow have invloved themselves in several successful outside projects such as:";

  services: Array<any> = [
    "Load Side and Service Entrance",
    "Residential, Commercial, and Industrial Electrical Services",
    "Net Metering Installation",
    "Designing of Electric Plan",
    "Fabrication of Gutter Box for Multi-metering Service Entrance",
    "Installation of Concrete Post and Intermediate Pole",
    "Meralco Service Applications(New Connection, Temporary, Remodel/Relocation, Reconnection, Transfer of Service)"
  ];

  bestServices: string = "L.A Garcia Electrical Contractor will always follow the routine of technology in becoming the leader in field.";

  bestServices2: string = "L.A Garcia Electrical Contractor appreciates that perfect management system is the foundation for providing quality products and services form of professional workmanship, quality, fast, efficient services and expertise of our highly competent management.";

  bestServices3: string = "True to its commitmnet, L.A Garcia Electrical Contractor earned the most Outstanding Distinctions in Awards given to CBMs in the South. Its most number of clients served per year has never been surpassed by any CBM contractor in the same line of work until today.";

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
