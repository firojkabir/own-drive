import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
})
export class FilesListComponent {
  nginxStatus: string = '';
  files: any[] = [];
  messages: any[] = [];
  messageForm = new FormGroup({
    userName: new FormControl('rimon'),
    message: new FormControl('hello'),
  });

  constructor(private fileService: FileService, private socket: Socket) {
    this.socket.on('newFileCreated', () => this.getFiles());
    this.socket.on('fileDeleted', () => this.getFiles());
    this.socket.on('fileRenamed', () => this.getFiles());
    this.socket.on('newMessage', (message: any) => {
      message.sentAt = new Date(message.sentAt).toString();
      this.messages = [...this.messages, message];
      console.log(this.messages);
    });
    this.socket.on('nginxStatusChanged', (action: string) => {
      this.nginxStatus = action;
    });
  }

  ngOnInit() {
    this.getFiles();
  }

  getFiles = () => {
    this.fileService.getFiles().subscribe({
      next: (files: string[]) => {
        this.files = files;
      },
    });
  };

  sendMessage = () => {
    console.log(this.messageForm.value);
    this.socket.emit('message', this.messageForm.value);
  };
}
