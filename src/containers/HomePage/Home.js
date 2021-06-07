import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import my from "../../DataStore/my";
import  "./Home.css"
class Home extends Component {

    columnsTotal = [{
        dataField: 'Id',
        text: 'Id',
      }, {
        dataField: 'Total Villages',
        text: 'Total Villages',
      }, {
        dataField: 'Total Population',
        text: 'Total Population',
      }, {
        dataField: 'Total Ao Population',
        text: 'Total Ao Population',
      },
      {
        dataField: 'Total Sema Population',
        text: 'Total Sema Population',
      },
      {
        dataField: 'Total Teny Population',
        text: 'Total Teny Population',
      },
      {
        dataField: 'Total Lotha Population',
        text: 'Total Lotha Population',
      },
      {
        dataField: 'Total Others',
        text: 'Total Other Population',
      }];

    render() {

        return (
            <div>
                <h3 className="home-heading">Constituencies</h3>
                
                <BootstrapTable
                      noDataIndication="Table is Empty. Please create Constituencies from the create page."
                      hover
                      condensed
                      keyField='Id'
                      data={ my }
                      columns={ this.columnsTotal }
                  />
            </div>
        );
    }
}

export default Home;