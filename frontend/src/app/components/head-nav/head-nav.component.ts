import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-head-nav',
  templateUrl: './head-nav.component.html',
  styleUrls: ['./head-nav.component.css']
})
export class HeadNavComponent {
  navbarScrolled: boolean = false;

  ngOnInit(): void {
    const navbar = document.getElementById('navbar')!;
    if(window.scrollY > 500) {
      this.navbarScrolled = true;
      navbar.classList.add('navbar-dark');
      navbar.classList.remove('navbar-light');
    }
    else {
      this.navbarScrolled = false;
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');
    }
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const navbar = document.getElementById('navbar')!;
    if(window.scrollY > 500) {
      this.navbarScrolled = true;
      navbar.classList.add('navbar-dark');
      navbar.classList.remove('navbar-light');
    }
    else {
      this.navbarScrolled = false;
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');
    }
    
  }
}
