import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ToolbarService } from '../../services/toolbar.service';

// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';

import { Subscription } from 'rxjs';

import { Base } from '../../../core/auth/_models/bases.model';
import { Permis } from '../../../core/auth/_models/permis.model';

import { ActivatedRoute, Router } from '@angular/router';
// Services and Models
import {
  currentUserBases,
  selectLastCreatedUserId,
  CreateUserPermis
} from '../../../core/auth';

import {
  LayoutUtilsService,
  MessageType
} from '../../../core/_base/crud';


@Component({
  selector: 'kt-custom-page3',
  templateUrl: './custom-page3.component.html',
  styleUrls: ['./custom-page3.component.scss']
})
export class CustomPage3Component implements OnInit , AfterViewChecked{
  idUser = 0;
  basicGama=false;
  mediumGama=false;
  premiumGama=false;
  shareBal = true;
  addUs = true;
  bases: Array<number>=[];

  allBases: Base[] = [];
  permis:Permis = {
    userId: undefined,
    basic: undefined,
    medium: undefined,
    premium: undefined,
    sharebalance: undefined,
    adduser: undefined,
    bases: []
  };

  // Private properties
	private subscriptions: Subscription[] = [];

  constructor( private activatedRoute:ActivatedRoute,
    private toolbarService:ToolbarService,
               private store: Store<AppState>,
               private layoutUtilsService: LayoutUtilsService,
               private router:Router) { }

  ngOnInit(): void {
    // const routSubscription =  this.activatedRoute.params.subscribe(params => {
    //   debugger;
    //   this.permis.userId = params.id;
    // });


    const addSubscription = this.store.pipe(select(selectLastCreatedUserId)).subscribe(newId => {
      console.log(newId);
      this.idUser=newId;
		});
		this.subscriptions.push(addSubscription);

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
    this.bases.push(base.baseId);
    //this.permis.bases.push(base.baseId);
  }

  savePermis(){
    this.permis.userId = this.idUser;
     this.permis.basic = this.basicGama;
     this.permis.medium = this.mediumGama;
     this.permis.premium = this.premiumGama;
     this.permis.sharebalance = this.shareBal;
     this.permis.adduser = this.addUs;
     this.permis.bases = this.bases;
    console.log(this.permis);

    this.store.dispatch(new CreateUserPermis({ permis: this.permis }));
    this.layoutUtilsService.showActionNotification('Registro insertado correctamente', MessageType.Create, 10000, true, false);
    const url = `/user-management/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

}
