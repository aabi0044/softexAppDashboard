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
  updateUser(id,data){
    return this.afs.doc('users/'+id).update(data);
  }
  getLotteries(){
  return  this.afs.collection('lotteries',ref=>ref.orderBy('date','desc')).snapshotChanges();
  }
  getSingleLottery(id){
    return this.afs.doc('lotteries/'+id).valueChanges();
  }
  getUser(id){
    return this.afs.doc('users/'+id).valueChanges();
  }
  getWinners(){
    return this.afs.collection('winners').snapshotChanges();
  }
  addWinner(data){
    return this.afs.collection('winners').add(data);
  }
}
