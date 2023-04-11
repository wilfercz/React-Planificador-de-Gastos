import {useState, useEffect} from 'react';

import Header from './components/Header';
import ListadoGastos from './components/ListadoGastos';
import Modal from './components/Modal';

import { generarId } from './helpers';

import IconoNuevoGasto from './img/nuevo-gasto.svg';
import Filtros from './components/Filtros';

function App() {

  const [presupuesto, setPresupuesto] = useState(JSON.parse(localStorage.getItem('presupuesto')) ?? 0);
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  
  const [modal, setModal] = useState(false);
  const[animarModal, setAnimarModal] = useState(false);

  const [gastos, setGastos] = useState(JSON.parse(localStorage.getItem('gastos')) ?? []);
  
  const [gastoEditar, setGastoEditar] = useState({});

  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);


  useEffect(()=>{
     if(Object.keys(gastoEditar).length > 0){
        handleNuevoGasto();
     }
  },[gastoEditar]);

  useEffect(()=>{
    Number(localStorage.setItem('presupuesto', presupuesto ?? 0));
  },[presupuesto]);

  useEffect(()=>{
    localStorage.setItem('gastos',JSON.stringify(gastos) ?? []);
  },[gastos]);

  useEffect(()=>{
    if(filtro){
        //Filtrar Gastos por Categoria
        const gastosfiltrados = gastos.filter((gasto)=>{
            return gasto.categoria === filtro;
        });

        setGastosFiltrados(gastosfiltrados);
    }
  },[filtro]);

  useEffect(()=>{
    if(presupuesto > 0){
        setIsValidPresupuesto(true);
    }
  },[]);

  const handleNuevoGasto = () =>{
      setModal(true);

      setTimeout(()=>{
          setAnimarModal(true);
      }, 500);
  }

  const guardarGasto = (gasto) =>{
      
    if(gasto.id){
        //Actualizar Gasto
        const gastosActualizados = gastos.map((gastoState)=>{
            return gastoState.id === gasto.id ? gasto : gastoState;
        });

        setGastos(gastosActualizados);
        setGastoEditar({});

    }else{
        //Nuevo Gasto
        gasto.id = generarId();
        gasto.fecha = Date.now();
        setGastos([...gastos, gasto]);
    }

    setAnimarModal(false)
    setTimeout(()=>{
        setModal(false);
    }, 500);
    
  }

  const eliminarGasto = (id) =>{
     const gastosActualizados = gastos.filter((gastoState)=>{
        return gastoState.id !== id;
     });

     setGastos(gastosActualizados);
  }

  return (
    <div className={modal ? 'fijar': ''}>
        <Header 
            presupuesto = {presupuesto}
            setPresupuesto = {setPresupuesto}
            isValidPresupuesto = {isValidPresupuesto}
            setIsValidPresupuesto = {setIsValidPresupuesto}
            gastos = {gastos}
            setGastos = {setGastos}
        />

      {isValidPresupuesto &&(
        <>
            <main>
                <Filtros 
                    filtro={filtro}
                    setFiltro={setFiltro}
                />
                <ListadoGastos 
                    gastos={gastos}
                    setGastoEditar={setGastoEditar}
                    eliminarGasto={eliminarGasto}
                    filtro={filtro}
                    gastosFiltrados={gastosFiltrados}
                />
            </main>
            <div className='nuevo-gasto'>
                <img 
                    src={IconoNuevoGasto} 
                    alt="Nuevo Gasto"
                    onClick={handleNuevoGasto}
                />
            </div>
        </>
      )}

      {modal && <Modal 
            setModal={setModal} 
            animarModal={animarModal} 
            setAnimarModal={setAnimarModal}
            guardarGasto={guardarGasto}
            gastoEditar={gastoEditar}
            setGastoEditar={setGastoEditar}
          />
      }

    </div>    
  )
}

export default App
