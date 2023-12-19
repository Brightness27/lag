import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {

  id: any;

  image: any;
  constructor(private activatedRoute: ActivatedRoute, private workflowService: WorkflowService) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.getImage();
  }

  getImage() {
    this.workflowService.getSpecificImageById(this.id).subscribe(image => {
      this.image = image;
    });
  }
}
