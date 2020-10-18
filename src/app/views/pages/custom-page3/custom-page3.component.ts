import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ToolbarService } from '../../services/toolbar.service';

// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';

import { Subscription } from 'rxjs';

import { Base } from '../../../core/auth/_models/bases.model';
import { Permis } from '../../../core/auth/_models/permis.model';

import { ActivatedRoute } from '@angular/router';
// Services and Models
import {
	currentUserBases
} from '../../../core/auth';


@Component({
  selector: 'kt-custom-page3',
  templateUrl: './custom-page3.component.html',
  styleUrls: ['./custom-page3.component.scss']
})
export class CustomPage3Component implements OnInit , AfterViewChecked{
  basicGama=false;
  mediumGama=false;
  premiumGama=false;
  shareBal = false;
  addUs = false;

  allBases: Base[] = [];
  permis:Permis


  // Private properties
	private subscriptions: Subscription[] = [];

  constructor(private activatedRoute:ActivatedRoute,
                      private toolbarService:ToolbarService,
              private store: Store<AppState>,) { }

  ngOnInit(): void {
    const routSubscription =  this.activatedRoute.params.subscribe(params => {
      this.permis.userId = params.id;
    });

    const basesSubscription = this.store.pipe(select(currentUserBases)).subscribe(res => this.allBases = res);
		this.subscriptions.push(basesSubscription);
  }

  ngAfterViewChecked() {
    this.toolbarService.emit(
      {
        parent:{name:'Community info', url:'/community'},
        children : [
          {name:'Alta de Usuarios', url: '/page2'},
          {name:'Permisos',url:'/page3' }
        ]
      });
  }




  addbas(base){
    console.log(base.baseId);
    this.permis.bases.push(base.baseId);
  }

  savePermis(){
     this.permis.basic = this.basicGama;
     this.permis.medium = this.mediumGama;
     this.permis.premium = this.premiumGama;
     this.permis.sharebalance = this.shareBal;
     this.permis.adduser = this.addUs;
    console.log(this.permis);
  }

}
