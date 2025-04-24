import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/core/Service/session.service';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss']
})
export class TablePageComponent implements OnInit {
  sessionTime = '';
  activeTime = '';
  isIdle = false;
  users: { name: string, age: number }[] = [];

  constructor(private session:SessionService,private router:Router) { }

  ngOnInit(): void {
    this.session.startSession();
    this.session.sessionTime$.subscribe(t => this.sessionTime = t);
    this.session.activeTime$.subscribe(t => this.activeTime = t);
    this.session.isIdle$.subscribe(idle => this.isIdle = idle);
  }
  ngOnDestroy() {
    this.session.stop();
  }

  addRow() {
    const names = ['Nirmal', 'Vikranth', 'Ajay'];
    const name = names[Math.floor(Math.random() * names.length)];
    const age = Math.floor(Math.random() * 41) + 20;
    this.users.push({ name, age });
  }

  deleteRow(index: number) {
    this.users.splice(index, 1);
  }

  resumeSession() {
    this.session.resume();
  }
  goToLandingPage(){
    this.router.navigate(['/landing']);

  }
}
