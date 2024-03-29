import React, { Component } from 'react';
import FotoItem from './Foto';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import TimelineApi from '../logicas/TimelineApi';


export default class TimelineStore extends Component {

    constructor(props){
      super(props);
      this.state = {fotos:[]};
      this.login = this.props.login;
    }

    componentWillMount(){
      this.props.store.subscribe(() => {
        this.setState({fotos:this.props.store.getState()});
      });
    }

    carregaFotos(){  
      let urlPerfil;

      if(this.login === undefined) {
        urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
      } else {
        urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.props.login}`;
      }

      this.props.store.dispatch(TimelineApi.lista(urlPerfil));
    }

    componentDidMount(){
      this.carregaFotos();
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.login !== undefined){
        this.login = nextProps.login;
        this.carregaFotos();
      }

    }

    like(fotoId){
      this.props.store.dispatch(TimelineApi.like(fotoId));
    }

    comenta(fotoId, textoComentario){
      this.props.store.dispatch(TimelineApi.comenta(fotoId, textoComentario));
    }

    render(){
        return (
        <div className="fotos container">
          <ReactCSSTransitionGroup
            transitionName="timeline"
            transitionEnterTimeout={500}
            transitionEnterTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)}/>)
          }
          </ReactCSSTransitionGroup>
        </div>            
        );
    }
}