import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/sevices/api/api.service';
import { Router } from '@angular/router';
import {map, first} from 'rxjs/operators'

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private api:ApiService,private router:Router) { }
users;
lotteries;
q=1;
p=1;
  ngOnInit() {
    this.getLotteries();
    this.getUsers();
  }
getUsers(){
  this.api.getUsers().pipe(map(list=>list.map(item=>{
    let data =item.payload.doc.data();
    let id =item.payload.doc.id;
    return{id,...data}
  }))).subscribe(res=>{
  this.users=res;
  console.log(this.users);
  })
}
getLotteries(){
  this.api.getLotteries().pipe(map(list=>list.map(item=>{
    let data =item.payload.doc.data();
    let id =item.payload.doc.id;
    return{id,...data}
  }))).subscribe(res=>{
  this.lotteries=res;
  console.log(this.lotteries);
  })
}
}
