import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

function Table() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('laptime');
  const [itemVisibility, setItemVisibility] = useState(true);
  const [laptimeFrom, setLaptimeFrom] = useState('');
  const [laptimeTo, setLaptimeTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [hasCar, setHasCar] = useState('');
  const [applyCondition, setApplyCondition] = useState([]) 

  // ovdje se dohvaćaju podaci iz API te se dodaju još pomoćni atributi u stvoreni objekt, atributi za vidljivost objekta te atribut za sortiranje što sam kasnije 
  // imao u planu iskoristiti za sortiranje te filtriranje
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://pacenotes.seleven.de/lap-service/rest/lap',
      );

      const modifiedData = result.data.map(item => ({
        ...item,
        itemVisibility: itemVisibility,
        orderBy: orderBy
      }));

      setData(modifiedData);
      
    };

    fetchData();
  }, []);

// glavna funkcija, gumb u kojem se spremaju parametri za filtriranje te soritranje u poseban objekt, nisam uspio sa time, napravio sam logiku u kojoj se
// vidljivost svakog objekta sa true prebacuje u false te bi svaki objekt čiji laptime ili timestamp nije u okviru, postaje nevidljiv
  const apply  = () => {
    let Conditions = {orderBy: orderBy, laptimeFrom: laptimeFrom, laptimeTo: laptimeTo, dateFrom:dateFrom, dateTo:dateTo, hasCar: hasCar, itemsPerPage: itemsPerPage}
    setApplyCondition(prevState => [...prevState, Conditions]);
    
    
    let newData = data.map( item => {
      
      if(item.laptime >= applyCondition[applyCondition.length-1].laptimeTo && item.laptime <= applyCondition[applyCondition.length-1].laptimeFrom){
        
        return({...item, itemVisibility: false})
      }
      return item
    })
    setData(newData);

    newData = data.map( item => {
      if(Date(item.date) >= Date(applyCondition[applyCondition.length-1].DateTo) && Date(item.date) <= Date(applyCondition[applyCondition.length-1].DateFrom)){
        return({...item, itemVisibility: false})
      }
      return item
    })
    setData(newData);

    newData = data.map( item => {
      
      return({...item, orderBy: applyCondition[applyCondition.length-1].orderBy})
      
    })
    setData(newData);

  }

  //dio za paginaciju, prvo sam napravio da klikom na gumb se na temelju odabranog parametra na select polju bira broj objekata na danoj stranici
  //ali to je uzrokovalo konstantno crashanje aplikacije, aplikacija se i dalje crasha ali samo prvim klikom na apply, nisam skužio zašto
  // klikom na jedno od izbora na select field se dobije željeni broj objekata na stranici
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <button
        key={number}
        onClick={() => setCurrentPage(number)}
        className={currentPage === number ? 'active' : ''}
      >
        {number}
      </button>
    );
  });

  return (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '30px' }}>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '30px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', margin: '16px' }}>
      <label htmlFor="select1">Date from:</label>
      <select value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}>
        <option value="">Please select</option>
        <option value="2022-06-16">2022-06-16</option>
        <option value="2022-06-16">2022-06-16</option>
        <option value="2022-06-26">2022-06-26</option>
      </select>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column',margin: '16px' }}>
      <label htmlFor="select2">To:</label>
      <select value={dateTo} onChange={(e) => setDateTo(e.target.value)}>
        <option value="">Please select</option>
        <option value="2023-04-04">2023-04-04</option>
        <option value="2022-09-30">2022-09-30</option>
        <option value="2022-10-05">2023-04-27</option>
      </select>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', margin: '16px' }}>
      <label htmlFor="select3">Max. Displayed information:</label>
      <select id="select3" value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
        <option value="">Please select</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', margin: '16px' }}>
      <label htmlFor="select4">Order By:</label>
      <select id="select4" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
        <option value="">Please select</option>
        <option value="timestamp">Timestamp</option>
        <option value="laptime">Laptime</option>
      </select>
    </div>
    <button type="submit" style={{ marginTop: '20px'}}  onClick={apply} >Apply</button>
  </div>

  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '30px', marginRight: '230px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', margin: '16px' }}>
      <label htmlFor="select1">Laptime from:</label>
      <select value={laptimeFrom} onChange={(e) => setLaptimeFrom(e.target.value)}>
        <option value="">Please select</option>
        <option value="07:57:976">07:57:976</option>
        <option value="07:57:976">07:57:976</option>
        <option value="07:57:976">07:57:976</option>
      </select>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column',margin: '16px' }}>
      <label htmlFor="select2">To:</label>
      <select value={laptimeTo} onChange={(e) => setLaptimeTo(e.target.value)}>
        <option value="">Please select</option>
        <option value="09:47:991">09:47:991</option>
        <option value="09:47:991">09:47:991</option>
        <option value="09:47:986">09:47:986</option>
      </select>
    </div>
    <div style={{ marginRight: '16px', marginTop: '25px', marginLeft: '20px' }}>
      <label>
        <input type="checkbox" value={hasCar} onChange={(e) => setHasCar(e.target.value)}/>
        With selected vehicle
      </label>
    </div>
  </div >
    <div>  
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Vehicle</th>
            <th>Laptime</th>
            <th>Date</th>
            <th>Timestamp</th>

          </tr>
        </thead>
        <tbody>
        {currentItems
              .sort((a,b) => a.orderBy > b.orderBy ? 1 : -1)
              .map(item => (
                !item.itemVisibility ? true : (
                  <tr key={item.id}>
                    <td>{item.driverName}</td>
                    <td>{item.driverVehicle}</td>
                    <td>{item.laptime}</td>
                    <td>{item.date}</td>
                    <td>{item.timestamp}</td>
                  </tr>
                )
              ))
            }
        </tbody>
      </table>
    </div>
      <div id="page-numbers">
        {renderPageNumbers}
      </div>
    </div>
  );
}

export default Table;
