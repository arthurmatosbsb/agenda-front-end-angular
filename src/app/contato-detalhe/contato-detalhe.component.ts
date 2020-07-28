import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contato } from '../contato/contato';
import { ContatoService } from '../contato.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contato-detalhe',
  templateUrl: './contato-detalhe.component.html',
  styleUrls: ['./contato-detalhe.component.css']
})
export class ContatoDetalheComponent implements OnInit {
  services: ContatoService;
  routers: Router;
  contatos: Contato;
  constructor(
    services: ContatoService,
    routers: Router,
    public dialogRef: MatDialogRef<ContatoDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public contato: Contato
  ) { }

  ngOnInit(): void {
  }
  fechar(){
    this.dialogRef.close();
  }

}
