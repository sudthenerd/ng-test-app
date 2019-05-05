import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.css']
})
export class ContactSearchComponent implements OnInit {

  /** Holds form instance */
  public contactSearchForm: FormGroup;

  /** Holds contact names */
  public contactList: any[];

  /** Holds filtered  contact names */
  public filteredContactList: any[];

  public showList: boolean;
  public showChip: boolean;
  public selectedContactsInfo: { index: number, name: string, extraText: string }[];

  @ViewChild('listWrapper') public listWrapper: ElementRef;
  @ViewChild('controlRef') public controlRef: ElementRef;

  constructor( private formBuilder: FormBuilder) {
    this.initContactSearchForm();
    this.contactList = [
      {index: 0, name: 'ram'},
      {index: 1, name: 'shyam'},
      {index: 2, name: 'sushil'},
      {index: 3, name: 'sushil1'},
      {index: 4, name: 'sushil2'},
      {index: 5, name: 'sushil3'},
      {index: 6, name: 'sushil4'},
      {index: 7, name: 'ram4'},
      {index: 8, name: 'ram4'},
      {index: 9, name: '4ram1'}
    ];
    this.filteredContactList = [];
    this.selectedContactsInfo = [];
    this.showList = true;
  }

  ngOnInit() {
  }

  /**
   * Initialize form control.
   */
  private initContactSearchForm(): void {
    this.contactSearchForm = this.formBuilder.group({
      contactSearch: []
    });
  }

  public onKeyUp() {
    const controlValue: string = this.contactSearchForm.value.contactSearch;

    if (!controlValue) {
      this.filteredContactList = [];
      return;
    }

    if (controlValue.indexOf('@') >= 0) {
      const searchIndex: number = controlValue.indexOf('@');
      const searchText: string = controlValue.substr(searchIndex + 1);

      let contactFound: boolean;
      let matchedIndex: number;
      const matchedContact: any = this.contactList.find((contactInfo: any, index: number) => {
        contactFound =  contactInfo.name === searchText;

        if (contactFound) {
          matchedIndex = index;
        }

        return contactFound;
      });

      if (contactFound) {
        this.updateSelectedContacts(matchedContact, matchedIndex);
        return;
      }

      this.filteredContactList = this.contactList.filter((contactInfo: any, index: number) => {
        return contactInfo.name.includes(searchText);
      });
    }

    this.filteredContactList = (this.filteredContactList && this.filteredContactList.length) ? this.filteredContactList : [];
    if (this.filteredContactList && this.filteredContactList.length) {
      this.activeItem(0);
    }
  }

  public clearSelection(event: any) {
    if (event.target.value) {
      return;
    }

    const lastItem: any = this.selectedContactsInfo.splice(-1, 1)[0];
    const extraText: string = lastItem.extraText;
    this.contactSearchForm.controls.contactSearch.setValue(extraText);
    const contactInfo = { index: lastItem.index, name: lastItem.name };
    this.contactList.splice(lastItem.index, 0, contactInfo);
  }

  public moveDown(event: any) {
    if (event.target === this.controlRef.nativeElement) {
      this.activeItem(0);
      this.setFocusOnItem(0);
    } else {
      event.target.nextElementSibling.classList.add('active');
      event.target.classList.remove('active');
      event.target.nextElementSibling.focus();
    }
    event.preventDefault();
  }

  public moveUp(event: any) {
    const listItems = this.listWrapper.nativeElement.getElementsByTagName('li');

    if (event.target === listItems[0].nativeElement) {
      event.target = listItems[-1].nativeElement;
    }

    event.target.previousElementSibling.classList.add('active');
    event.target.classList.remove('active');
    event.target.previousElementSibling.focus();
    event.preventDefault();
  }

  public selectContact(contactInfo) {
    this.updateSelectedContacts(contactInfo, contactInfo.index);
    this.controlRef.nativeElement.focus();
  }

  private updateSelectedContacts(contactInfo: any, index: number): void {
    this.selectedContactsInfo.push(this.filterExtraText(contactInfo));
    this.contactSearchForm.controls.contactSearch.setValue(null);

    const idx = this.contactList.findIndex((item: any) => {
      return item.index === index;
    });
    this.contactList.splice(idx, 1);
    this.filteredContactList = [];
  }

  private filterExtraText(matchedContactInfo) {
    const extraText: string = this.contactSearchForm.value.contactSearch.split('@')[0];
    matchedContactInfo.extraText = extraText;
    return matchedContactInfo;
  }

  private activeItem(index) {
    this.listWrapper.nativeElement.getElementsByTagName('li')[index].classList.add('active');
  }

  private setFocusOnItem(index) {
    this.listWrapper.nativeElement.getElementsByTagName('li')[index].focus();
  }
}
