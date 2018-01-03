import { Component, Output, Input, EventEmitter } from '@angular/core';
import { YoutubePlaylistService, Playlist, HttpUtilService} from 'angular2-youtube';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private playlist:Playlist[];
  private playlistYoutube:any;
  private msgErro: string;

  // player created and initialized - sends instance of the player
  @Output() ready = new EventEmitter<YT.Player>();
  // state change: send the YT event with its state
  @Output() change = new EventEmitter<YT.PlayerEvent>();

  constructor(private youtubePlaylist:YoutubePlaylistService) { }
  
  title = 'My Video Player';
  videos;
  playListId;
  player: YT.Player;
  fetched = false;
  id: string = '';
  counter=0;
  private key: string = "AIzaSyAsD7pMG9GkWGp9G68wsJvZwXz50wie99s";

  savePlayer (player) {
    this.player = player;
    console.log('player instance', player)
  }

  onStateChange(event){
    console.log('player state', event);
  }

  getUniqueID(url){
  	return url.split("list=")[1];
  }

  fetch(event, url){
  	console.log(event);
  	console.log(url.value);
  	this.playListId = this.getUniqueID(url.value);
  	console.log(this.playListId);
  	this.getplaylist();
  }

  getplaylist() {
    this.playlistYoutube = this.youtubePlaylist.getplaylist(this.key, this.playListId)
    .subscribe(value => {
		this.playlistYoutube = value;
		console.log(this.playlistYoutube);
		console.log(this.playlistYoutube.items);
		this.id = this.playlistYoutube.items[0].snippet.resourceId.videoId;
		this.videos = this.playlistYoutube.items;
		console.log(this.id);
		this.player.loadVideoById(this.id);
		this.fetched = true;
    });
    console.log('s');
  }

  nextPage(pageToken:string){
    this.playlistYoutube = this.youtubePlaylist.playlistList_page(this.key, this.playListId, pageToken).subscribe(value => {
              this.playlistYoutube = value;
               console.log(this.playlistYoutube);
               console.log(this.playlistYoutube.items);
               this.counter++;
    });
  }

  prevPage(pageToken:string){
    this.playlistYoutube = this.youtubePlaylist.playlistList_page(this.key, this.playListId, pageToken).subscribe(value => {
              this.playlistYoutube = value;
               console.log(this.playlistYoutube);
               console.log(this.playlistYoutube.items);
               this.counter--;
    });
  }
}
