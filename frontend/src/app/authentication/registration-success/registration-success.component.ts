import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent implements OnInit {
  redirectCount = 3;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.redirectCount--;
      if (this.redirectCount === 0) {
        this.router.navigate(['/auth/login']);
      }
    }, 1000);
  }
}
