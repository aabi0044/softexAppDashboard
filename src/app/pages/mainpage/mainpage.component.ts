import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/sevices/api/api.service';
import { Router } from '@angular/router';
import { map, first } from 'rxjs/operators'

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) { }
  users;
  lotteries;
  q = 1;
  p = 1;
  r = 1;
  weekLotteries;
  winner;
  weekWinner;
  allwinners;
  winnerValue = null;
  totalWinners = null;
  len: number;
  checkValue;
  showSelectionForLotteries=false;
  winnersDescided=false;
  selectedValue=true;
  noLotteries=false;
  choseLess=false;
  noWinner=false;
  ngOnInit() {
    this.getLotteries();
    this.getUsers();
    this.getCurrentWeekWinner();
    this.getAllWinners();
  }

  // shuffle(a) {
  //   for (let i = a.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [a[i], a[j]] = [a[j], a[i]];
  //   }
  //   return a;
  // }


  getUsers() {
    this.api.getUsers().pipe(map(list => list.map(item => {
      let data = item.payload.doc.data();
      let id = item.payload.doc.id;
      return { id, ...data }
    }))).subscribe(res => {
      this.users = res;
      // console.log(this.users);
    })
  }
  getLotteries() {
    this.api.getLotteries().pipe(map(list => list.map(item => {
      let data = item.payload.doc.data();
      let id = item.payload.doc.id;
      return { id, ...data }
    }))).subscribe((res: any) => {
      this.lotteries = res;
      // console.log(this.lotteries);
      var curr = new Date;
      // console.log(curr.getDate());
      // console.log(curr.getDay());
      curr.setUTCHours(0, 0, 0, 0)
      var first = (curr.getDate() - curr.getDay()) + 4; // First day is the day of the month - the day of the week
      var last = first + 7; // last day is the first day + 6

      var firstday = new Date(curr.setDate(first));
      var lastday = new Date(curr.setDate(last));
      // console.log(firstday);
      // console.log(lastday);
      let a = res.filter(item => {
        var dummy = new Date(item.date)
        // console.log(dummy);

        return dummy >= firstday && dummy < lastday
      })
      console.log(a);
      this.weekLotteries = a;
      let now = new Date
      let today = now.getDay();
      if (today == 4) {
     this.showSelectionForLotteries=true;
      }
      // console.log(today);
    })
  }
  chooseWinner() {
    if (this.winnerValue != null) {
this.selectedValue=true;
      let result = [];
      let dummy = [];
      let ran;


      let descide = [...new Set(this.weekLotteries)];
      console.log(descide.length);
      if (descide.length >= this.winnerValue) {
        while (dummy.length < this.winnerValue) {

          ran = this.weekLotteries[Math.floor(Math.random() * this.weekLotteries.length)];
          result.push(ran.userId);
          dummy = [...new Set(result)];

        }

        for (let i = 0; i < dummy.length; i++) {
          this.api.getUser(dummy[i]).pipe(first()).toPromise().then((resp:any) => {

            let data = {
              name: resp.name,
              email: resp.email,
              id: dummy[i],
              phoneNumber: resp.phoneNumber,
              points: resp.points,
              winTime: resp.win + 1,
              date: Date.now()
            }
            this.api.addWinner(data).then(res => {
              let user = {
                win: resp.win + 1
              }
              this.api.updateUser(dummy[i], user).then(resp => {
                console.log("user Updated");
              }).catch(err => {
                console.log(err);
              })
            }).catch(err => {
              console.log(err);
            })

            console.log(resp);

          })
        }



      }else {
if(descide.length==0){
  // console.log("No body enter lottery this week");
  this.noLotteries=true;
}else{
  // console.log("must chose less value");
  this.choseLess=true;
}
      }


    }
    else{
      this.selectedValue=false;
      // console.log("must select value");
    }
  }





  getCurrentWeekWinner() {
    this.api.getWinners().pipe(map(list => list.map(item => {
      let data = item.payload.doc.data();
      let id = item.payload.doc.id;
      return { id, ...data }
    }))).subscribe((res: any) => {

      var curr = new Date;

      curr.setUTCHours(0, 0, 0, 0)
      var first = (curr.getDate() - curr.getDay()) - 3; // First day is the day of the month - the day of the week
      var last = first + 7; // last day is the first day + 6

      var firstday = new Date(curr.setDate(first));
      var lastday = new Date(curr.setDate(last));

      let a = res.filter(item => {
        var dummy = new Date(item.date)
        console.log(dummy);

        return dummy >= firstday && dummy < lastday
      })
      console.log(a);
      this.weekWinner = a;
      if(this.weekWinner.length>0){
        this.winnersDescided=true;
      }else{
        this.noWinner=true;
      }

    })
  }
  getAllWinners() {
    this.api.getWinners().pipe(map(list => list.map(item => {
      let data = item.payload.doc.data();
      let id = item.payload.doc.id;
      return { id, ...data }
    }))).subscribe((res: any) => {
      this.allwinners = res;
      console.log(res);

    })
  }
}
