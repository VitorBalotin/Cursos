import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService{
    constructor(){
        this.http = new HttpService();
    }

    obterNegociacoes(){
        return Promise.all([
            this.obterNegociacaoDaSemana(),
            this.obterNegociacaoDaSemanaAnterior(),
            this.obterNegociacaoDaSemanaRetrasada()
        ]).then(periodos => {
            let negociacoes = periodos.reduce((dados, periodo) => dados.concat(periodo),[]);
            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
    }

    obterNegociacaoDaSemana(){
            return this.http.get('negociacoes/semana')
                     .then(negociacoes => {
                         return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
                     })
                     .catch(erro => {
                         console.log(erro);
                         throw new Error('Não foi possível obter as negociações da semana.');
                     });
    }

    obterNegociacaoDaSemanaAnterior(){
            return this.http.get('negociacoes/anterior')
                     .then(negociacoes =>{
                         console.log(negociacoes);
                         return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
                     })
                     .catch(erro => {
                         console.log(erro);
                         throw new Error('Não foi possível obter as negociações da semana anterior.');
                     });
    }
    


    obterNegociacaoDaSemanaRetrasada(){
            return this.http.get('negociacoes/retrasada')
                     .then(negociacoes => {
                         return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
                     })
                     .catch(erro => {
                         console.log(erro);
                         throw new Error('Não foi possível obter as negociações da semana retrasada.');
                     });
    }

    cadastra(negociacao){

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso.')
            .catch(() => {
                console.log(erro);
                throw new Error ('Não foi possível adicionar a negociação')
            });
    }

    lista(){
        return ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.listaTodos())
                .catch(erro => {
                    console.log(erro);
                    throw new Error('Não foi possível obter as negociações');
                })
    }

    apaga(){
       return ConnectionFactory
        .getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.apagaTodos())
        .then(() => 'Negociações apagadas com sucesso')
        .catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível apagar as negociações.')
        })
    }

    importa(listaAtual){
        return this.obterNegociacoes()
            .then(negociacoes => negociacoes.filter(negociacao => 
                !listaAtual.some(negociacaoExistente => 
                    JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível buscar negociações para importar');
            })
    }
    
}