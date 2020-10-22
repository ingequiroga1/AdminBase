// Angular
import { Component,OnInit } from '@angular/core';
import {LayoutConfigService} from '../../../../core/_base/layout';
import { currentUserBases, SelectBase} from '../../../../core/auth';

// RxJS
import { Observable } from 'rxjs';

// NGRX
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/core/reducers';
import { Base } from '../../../../core/auth/_models/bases.model';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';


@Component({
  selector: 'kt-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  searchDisplay = true;
  notificationsDisplay = true;
  quickActionsDisplay = true;
  cartDisplay = true;
  quickPanelDisplay = true;
  languagesDisplay = true;
  userDisplay = true;
  userLayout = 'offcanvas';
  userDropdownStyle = 'light';

  bases$: Observable<Base[]>;

  formBases: FormGroup;
  selected = 'Unosquare';

  nombre = ''
  allBases:Base[];
  seloption = 'Opcion';
 
  // basesUser = [];

  constructor(private layoutConfigService: LayoutConfigService,
              private store: Store<AppState>,
              private FB: FormBuilder ) {
    this.searchDisplay = this.layoutConfigService.getConfig('extras.search.display');
    this.notificationsDisplay = this.layoutConfigService.getConfig('extras.notifications.display');
    this.quickActionsDisplay = this.layoutConfigService.getConfig('extras.quick-actions.display');
    this.cartDisplay = this.layoutConfigService.getConfig('extras.cart.display');
    this.quickPanelDisplay = this.layoutConfigService.getConfig('extras.quick-panel.display');
    this.languagesDisplay = this.layoutConfigService.getConfig('extras.languages.display');
    this.userDisplay = this.layoutConfigService.getConfig('extras.user.display');
    this.userLayout = this.layoutConfigService.getConfig('extras.user.layout');
    this.userDropdownStyle = this.layoutConfigService.getConfig('extras.user.dropdown.style');
  }

  ngOnInit(): void {
    this.formBases = this.FB.group({
      baseName:['']
    });

    this.store.pipe(select(currentUserBases)).subscribe(res => {
      this.allBases = res;
      this.store.dispatch(new SelectBase({base: this.allBases[0]}))
      this.formBases.get('baseName').setValue(res[0]?.baseId)
    })

     const baseDefault = this.allBases.find(b => b.baseId = 10);
     





    //this.bases$ = this.store.pipe(select(currentUserBases));

    // this.bases$.subscribe((bases: Base[])=>{
    //   const bas = bases.filter((v:Base)=>v.baseId===10)
    //   this.nombre = bas[0].name
    //   this.store.dispatch(new SelectBase({base: bas[0]}))
    // });
  }

  selectbase(event){
    debugger;
    console.log(event.value);
    //   this.bases$.subscribe((bases: Base[])=>{
    //    const bas = bases.filter((v:Base)=>v.baseId===event.value)
    //    this.store.dispatch(new SelectBase({base: bas[0]}))
    //  });
    const bas = this.allBases.filter((v:Base)=>v.baseId===event.value)
    this.store.dispatch(new SelectBase({base: bas[0]}))

    
  }
}
