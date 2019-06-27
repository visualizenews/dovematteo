import React, {Component} from 'react';

import './Intro.css';

class Intro extends Component {
  render() {
    return (
      <div className="Intro">
        <div className="text">
          <h3>Dopo gli esperimenti di precedenti Governi a partecipazione leghista di decentralizzare i Ministeri (ricordate i <a href="https://www.repubblica.it/politica/2011/07/23/news/ministeri_inaugurati_uffici_a_villa_reale_appese_foto_di_napolitano_e_bossi-19516299/">Ministeri per l’Economia, Semplificazione, e Riforme con sedi distaccate nella Villa Reale di Monza</a>?) finalmente questo Governo è riuscito a spingere l’innovazione fino a vette mai viste: anziché dicasteri decentralizzati la nostra Repubblica ha ora un <em>Ministro Itinerante</em>, un <em>Capitano</em> che si rende conto di non poter esercitare il necessario controllo sulla Nazione dal suo ufficio al Viminale, e che quindi, a bordo della sua ruspa, continua a visitare tutti i più remoti angoli del Paese.</h3>
          <h3>Ma quanto è difficile stargli dietro? <em>Noi stiamo provando a seguirlo</em>, per la gioia nostra e di tutti i suoi fan.</h3>
        </div>
      </div>
    );
  }
}

export default Intro;



