import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading-service/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  loading!: boolean;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
}
