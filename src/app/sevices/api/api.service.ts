import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs:AngularFirestore) { }
  getUsers(){
    return this.afs.collection('users').snapshotChanges();
  }
  getLotteries(){
  return  this.afs.collection('lotteries',ref=>ref.orderBy('date','desc')).snapshotChanges();
  }
  getSingleLottery(id){
    return this.afs.doc('lotteries/'+id).valueChanges();
  }
}
