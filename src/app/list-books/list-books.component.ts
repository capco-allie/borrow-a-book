import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.scss']
})
export class ListBooksComponent implements OnInit {
  DUMMY_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt rhoncus ligula, ut venenatis enim rutrum sit amet. Duis convallis, elit at euismod egestas, augue.";
  UNFILTERED_LIST_DATA: string[];
  FILTERED_LIST_DATA: string[];
  LIST_VIEW: any;
  PAGINATOR_BUTTON: any;
  SEARCH_STRING: string;
  FORMATTED_PRICE: string;
  IS_FILTERED: boolean;
  PAGINATOR = 6;
  PAGINATOR_LENGTH = 6;
  constructor(private httpService: HttpClient) { }

  ngOnInit() {
    this.httpService.get('./assets/list.json').subscribe(
      data => {
        this.UNFILTERED_LIST_DATA = data as string[];
        this.loadListItems(this.UNFILTERED_LIST_DATA, 0, this.PAGINATOR);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  getListViewElement(listViewElement){
    this.LIST_VIEW = listViewElement;
  }

  getPaginatorElement(paginatorElement){
    this.PAGINATOR_BUTTON = paginatorElement;
  }

  filterItems(event){
    this.SEARCH_STRING = event.target.value;
    if(this.SEARCH_STRING.length >= 3){
      this.clearListView();
      this.IS_FILTERED = true;
      this.FILTERED_LIST_DATA = this.UNFILTERED_LIST_DATA.filter(data => data['title'].toLowerCase().includes(this.SEARCH_STRING.toLowerCase()));
      this.loadListItems(this.FILTERED_LIST_DATA, 0, this.PAGINATOR);
    } else if(this.SEARCH_STRING.length < 3){
      this.clearListView();
      this.IS_FILTERED = false;
      this.loadListItems(this.UNFILTERED_LIST_DATA, 0, this.PAGINATOR);
    }
  }

  paginateList(){
    if(this.IS_FILTERED){
      this.loadListItems(this.FILTERED_LIST_DATA, this.PAGINATOR + 1, this.PAGINATOR + 6);
      this.togglePaginator(this.FILTERED_LIST_DATA.length, this.PAGINATOR_LENGTH);
    } else if(!this.IS_FILTERED){
      this.loadListItems(this.UNFILTERED_LIST_DATA, this.PAGINATOR + 1, this.PAGINATOR + 6);
      this.togglePaginator(this.UNFILTERED_LIST_DATA.length, this.PAGINATOR_LENGTH);
    }
    this.PAGINATOR += 6;
  }

  togglePaginator(listLength, paginatorSize){
    if(listLength <= paginatorSize){
      this.PAGINATOR_BUTTON.style.display = "none";
    } else if(listLength > paginatorSize ){
      this.PAGINATOR_BUTTON.style.display = "block";
    }
    
    if(this.PAGINATOR >= listLength){
      this.PAGINATOR_BUTTON.style.display = "none";
    }
  }

  clearListView(){
    this.LIST_VIEW.innerHTML = '';
  }

  loadListItems(listItemData, paginatorStart, paginatorEnd){
    this.togglePaginator(listItemData.length, this.PAGINATOR_LENGTH);
    listItemData.slice(paginatorStart, paginatorEnd).map((data, index) => {  
      this.LIST_VIEW.innerHTML += `
        <li class="list__item">
          <figure class="figure">
            <img class="figure_image" src="${data['thumbnailUrl']}" alt="Thumbnail not available." />
            <h3 class="figure_title">${data['title']}</h3>
              <figcaption class="figure_caption">
                Price: $${data['price']} <br><br>
                ${data['shortDescription'] || this.DUMMY_TEXT }
            </figcaption>
          </figure>
        <div class="list_action">
          <button>Add</button>
          <button>Remove</button>
        </div>
        </li>`;
    });
  }
}
