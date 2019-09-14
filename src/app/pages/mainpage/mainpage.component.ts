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
weekLotteries;
winner;
weekWinner;
  ngOnInit() {
    this.getLotteries();
    this.getUsers();
    this.getCurrentWeekWinner();
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
  }))).subscribe((res:any)=>{
  this.lotteries=res;
  console.log(this.lotteries);
  var curr = new Date;
  console.log(curr.getDate());
  console.log(curr.getDay());
  curr.setUTCHours(0,0,0,0)
  var first = (curr.getDate() - curr.getDay())+4; // First day is the day of the month - the day of the week
var last = first + 7; // last day is the first day + 6

var firstday = new Date(curr.setDate(first));
var lastday = new Date(curr.setDate(last));
console.log(firstday);
console.log(lastday);
let a=res.filter(item=>{
  var dummy=new Date(item.date)
  console.log(dummy);

return dummy>=firstday && dummy< lastday
})
console.log(a);
this.weekLotteries=a;
let now= new Date
let today=now.getDay();
if(today==6){
  this.getWinners();
}
console.log(today);
  })
}
chooseWinner(){
  var ran = this.weekLotteries[Math.floor(Math.random() * this.weekLotteries.length)];
  console.log(ran);
  this.api.getUser(ran.userId).pipe(first()).toPromise().then(resp=>{
    this.winner=resp;
    let data={
name:this.winner.name,
email:this.winner.email,
id:ran.userId,
phoneNumber:this.winner.phoneNumber,
points:this.winner.points,
winTime:this.winner.win+1,
date: Date.now()
    }
    this.api.addWinner(data).then(res=>{
let user={
  win:this.winner.win+1
}
this.api.updateUser(ran.userId,user).then(resp=>{
  console.log("user Updated");
}).catch(err=>{
  console.log(err);
})
    }).catch(err=>{
      console.log(err);
    })

    console.log(this.winner);
  })
}
getWinners(){
  this.api.getWinners().pipe(map(list=>list.map(item=>{
    let data =item.payload.doc.data();
    let id =item.payload.doc.id;
    return{id,...data}
  }))).subscribe((res:any)=>{
    var curr = new Date;
  console.log(curr.getDate());
  console.log(curr.getDay());
  curr.setUTCHours(0,0,0,0)
  var first = (curr.getDate() - curr.getDay())+4; // First day is the day of the month - the day of the week
var last = first + 7; // last day is the first day + 6

var firstday = new Date(curr.setDate(first));
var lastday = new Date(curr.setDate(last));
console.log(firstday);
console.log(lastday);
let a=res.filter(item=>{
  var dummy=new Date(item.date)
  console.log(dummy);

return dummy>=firstday && dummy< lastday
})
if(a.length==0){
  this.chooseWinner();
}else{
  console.log("winner is already Declared");
}
  })
}
getCurrentWeekWinner(){
  this.api.getWinners().pipe(map(list=>list.map(item=>{
    let data =item.payload.doc.data();
    let id =item.payload.doc.id;
    return{id,...data}
  }))).subscribe((res:any)=>{
    var curr = new Date;
  console.log(curr.getDate());
  console.log(curr.getDay());
  curr.setUTCHours(0,0,0,0)
  var first = (curr.getDate() - curr.getDay())+4; // First day is the day of the month - the day of the week
var last = first + 7; // last day is the first day + 6

var firstday = new Date(curr.setDate(first));
var lastday = new Date(curr.setDate(last));
console.log(firstday);
console.log(lastday);
let a=res.filter(item=>{
  var dummy=new Date(item.date)
  console.log(dummy);

return dummy>=firstday && dummy< lastday
})
console.log(a);
this.weekWinner=a[0];

})
}
}
