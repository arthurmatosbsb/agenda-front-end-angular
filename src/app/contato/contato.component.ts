import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { ContatoService } from '../contato.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  contato: Contato;
  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'nome', 'telefone', 'email', 'favorito', 'delete'];
  totalElementos = 0;
  pagina = 0;
  tamanho = 5;
  pagaSizeOptions: number[] = [5];
  mensagemSucesso: string;
  mensagemErro: string;

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.montarFormulario();

    this.listar(this.pagina, this.tamanho);

  }

  remove(contato: Contato){
    console.log(contato);
   this.service.delete(contato).subscribe( 
    response => {
      this.mensagemSucesso = 'Cliente deletado com sucesso!'
      this.ngOnInit();
    },
    erro => this.mensagemErro = 'Ocorreu um erro ao deletar o cliente.'  
  )
  }
  montarFormulario() {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]]
    })
  }
  favoritar(contato: Contato) {
    this.service.favourite(contato).subscribe(
      response => {
        contato.favorito = !contato.favorito;
      }
    )
  }
  listar(pagina = 0, tamanho = 5) {
    this.service.list(pagina, tamanho).subscribe(
      response => {
        this.contatos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
      }
    )
  }
  submit() {
    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email, formValues.telefone);
    this.service.save(contato).subscribe(
      response => {
        this.listar();
        this.snackBar.open('O Contato foi adicionado!', 'Sucesso!', {
          duration: 2000
        })
        this.formulario.reset();
      })
  }
  uploadFoto(event, contato) {
    const files = event.target.files;
    if (files) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service.upload(contato, formData).subscribe(
        response => this.listar());

    }
  }
  visualizarContato(contato: Contato) {
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px', height: '450px', data: contato
    })
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.listar(this.pagina, this.tamanho);
  }
}

