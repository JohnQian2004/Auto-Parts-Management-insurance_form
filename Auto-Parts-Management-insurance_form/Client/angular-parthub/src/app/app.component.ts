import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventData } from './_shared/event.class';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Note } from './models/note.model';
import { User } from './models/user.model';
import { NoteService } from './_services/note.service';
import { UserService } from './_services/user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SequenceCarrier } from './models/sequence.carrier.model';
import { Config } from './models/config.model';
import { FeedbackService } from './_services/feedback.service';
import { Feedback } from './models/feedback.model';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  isActivated = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  user: User = new User();
  users: User[] = new Array();

  showIt: boolean = true;
  currentUser: any;
  showNavationBar = true;
  notes: Note[] = new Array();
  note: Note = new Note();
  username?: string;
  showAccordian: boolean = true;
  eventBusSub?: Subscription;

  config: Config = new Config();
  market_only: boolean = this.config.market_only;

  feedback: any = {
    id: 0,
    name: undefined,
    comments: ""

  };

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private feedbackService: FeedbackService,
    private titleService: Title,
    private metaService: Meta
  ) {

    this.titleService.setTitle(this.config.siteTitle);
    this.metaService.updateTag({ property: 'og:url', content: this.config.ogUrl });
    this.metaService.updateTag({ property: 'og:title', content: this.config.ogTitle });
    this.metaService.updateTag({ property: 'twitter:site', content: this.config.twitterSite });
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // Hide sidebar on the home page
    //     this.showNavationBar = event.urlAfterRedirects !== '/autoparts';
    //   }
    // });
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();

  }

  errorMessageFeedback: any = "";
  setFeedback(): void {
    console.log(this.feedback.comments);
    if (this.feedback.name == undefined) {
      this.errorMessageFeedback = "Please select a Category";
    }

    if (this.feedback.comments != null && this.feedback.comments.length < 2) {
      this.errorMessageFeedback = "Comments are too short";
    }

    if (this.feedback.comments != null && this.feedback.comments.length > 2000) {
      this.errorMessageFeedback = "Comments are too long";
    }

    var feedback = new Feedback();

    feedback.name = this.feedback.name;
    feedback.comments = this.feedback.comments;
    feedback.userId = this.user.id;
    feedback.companyId = this.user.companyId;

    this.feedbackService.createFeedback(this.user.id, feedback).subscribe({
      next: result => {
        this.feedback = result;
        console.log(result);
        if (this.feedback.id > 0) {
          this.errorMessageFeedback = "Submitted succesfully";
        }
      }
    })

  }

  resetFeedbackForm() {
    this.feedback = {
      id: 0,
      name: undefined,
      comments: ""

    };

    this.errorMessageFeedback = "";
  }

  saveNote(): void {

    //console.log("saveNote" + this.note.notes);

    if (this.note.notes != null && this.note.notes != '') {
      this.note.companyId = this.user.companyId;
      //console.log("before " + this.note.notes);
      this.noteService.createNote(this.currentUser.id, this.note).subscribe({
        next: result => {
          if (result) {
            this.note = result;
            //console.log("after " + this.note.notes);
            var hasIt: boolean = false;
            for (let note of this.notes) {
              if (note.id == this.note.id) {
                hasIt = true;
              }
            }
            if (hasIt == false)
              this.notes.unshift(this.note);

            this.note = new Note();
          }
        }
      })
    }
  }
  onSaveNote($event: any): void {

    if ($event.target.value != null && $event.target.value != '') {
      const note = {
        notes: $event.target.value,
        color: this.note.color,
        userId: this.user.id,
        companyId: this.user.companyId,
        id: this.note.id
      }

      this.noteService.createNote(this.currentUser.id, note).subscribe({
        next: result => {
          if (result) {
            this.note = result;
            var hasIt: boolean = false;
            for (let note of this.notes) {
              if (note.id == this.note.id) {
                hasIt = true;
              }
            }
            if (hasIt == false)
              this.notes.unshift(this.note);

            this.note = new Note();
          }
        }
      })
    }

  }
  deleteNote(note: Note): void {

    this.noteService.deleteNoteWithUserId(this.user.id, note.id).subscribe({
      next: result => {

        var index: any = 0;
        for (let note1 of this.notes) {
          if (note1.id == note.id) {
            this.notes.splice(index, 1);
          }

          index++;
        }
        this.note = new Note();
      }
    });
  }
  addNewNote(): void {
    this.note = new Note();
  }
  droppedNote(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.notes,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.notes.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.notes[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.noteService.updateSeqence(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.notes = result;
          this.notes = this.notes.filter(note => note.jobId == 0);
          this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }

  isNotShopDisplayUser(): boolean {
    if (this.user.shopDisplayUser == true)
      return false;
    else
      return true;
  }

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {
          this.showModeratorBoard = false;
        }

        if (this.user.companyId != 0) {
          this.getAllNotes(this.user.companyId);
        }


      }
    })

  }
  getAllNotes(companyId: any): void {

    this.notes = new Array();

    this.noteService.getAllCompanyNote(companyId).subscribe({
      next: result => {
        if (result != null)
          this.notes = result;
        this.notes = this.notes.filter(note => note.jobId == 0);
        this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      }
    })
  }
  getNoteDetail(note: Note): void {

    if (note.jobId > 0) {
      this.eventBusService.emit(new EventData('disply', note.jobId));
    } else {
      this.note = note;
    }
    console.log(this.note);
  }
  printJobDetail(note: Note): void {
    this.note = note;
    if (note.jobId > 0) {
      this.eventBusService.emit(new EventData('print', note.jobId));
    }
    console.log(this.note);
  }
  getTitle(note: Note): any {
    if (note.jobId > 0)
      return "Open Job [" + note.jobId + "]";
    else
      return "Edit";
  }
  subMenuStates: { [key: string]: boolean } = {};

  toggleSubMenu(subMenuId: string): void {
    this.subMenuStates[subMenuId] = !this.subMenuStates[subMenuId];
  }

  isSubMenuOpen(subMenuId: string): boolean {
    return this.subMenuStates[subMenuId];
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.isActivated = this.storageService.getUser()?.activated;

    //console.log(" app ");
    if (this.isLoggedIn && this.isActivated) {
      const user = this.storageService.getUser();
      this.currentUser = user;
      this.roles = user.roles;
      this.currentUser = user;

      if (this.roles.includes('ROLE_ADMIN')) {
        this.showAdminBoard = true;
        this.showModeratorBoard = true;
      }

      if (this.roles.includes('ROLE_SHOP')) {
        this.showModeratorBoard = true;
      }

      this.getUserById(this.currentUser.id);
      // this.userService.getUserById(this.currentUser.id).subscribe({
      //   next: result => {
      //     //console.log(result);
      //     this.user = result;
      //     if( this.user.partMarketOnly == true){
      //       this.showModeratorBoard = false;
      //     }
      //   }
      // });



      // if (this.roles.includes('ROLE_RECYCLER') || this.roles.includes('ROLE_SHOP')) {
      //   this.showModeratorBoard = true;

      // }

      // this.showModeratorBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      // this.showModeratorBoard = this.roles.includes('ROLE_RECYCLER');
      // this.showModeratorBoard = this.roles.includes('ROLE_SHOP');

      this.username = user.username;
    } else {
      this.storageService.clean();
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          // Hide sidebar on the home page
          this.showNavationBar = event.urlAfterRedirects !== '/autoparts' && event.urlAfterRedirects !== '/requestparts';
        }
      });
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    this.eventBusSub = this.eventBusService.on('username', (data: any) => {
      this.username = data;
      console.log(" app event " + data);
    });

    this.eventBusSub = this.eventBusService.on('noshow', (data: any) => {
      console.log(" app event " + data);
      this.showNavationBar = false;
    })

    this.eventBusSub = this.eventBusService.on('refresh', (data: any) => {
      console.log(" app event " + data);
      this.getAllNotes(this.user.companyId)
    })

  }

  navigateToHome(path: any, showPostForm: boolean) {

    this.router.navigate(['/shop/' + path + '/' + showPostForm],
      { skipLocationChange: true });

  }

  navigateTo(path: any, showPostForm: boolean) {

    this.router.navigate(['/' + path + '/' + showPostForm],
      { skipLocationChange: true });

  }

  navigateToSilence(path: any) {
    console.log(path);
    this.router.navigate([path],
      { skipLocationChange: true });

  }

  logout(): void {

    console.log(" logging out ");
    this.authService.logout().subscribe({

      next: res => {
        console.log(res);
        this.storageService.clean();
        //this.isLoggedIn = this.storageService.isLoggedIn();
        this.isLoggedIn = false;
        //this.isLoggedIn= false;
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  showVehicleListing: boolean = true;

  toggleDivs() {
    this.showVehicleListing = !this.showVehicleListing;
  }
}
