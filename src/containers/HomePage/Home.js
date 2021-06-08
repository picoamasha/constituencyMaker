import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import  "./Home.css";
import axios from "../../axios-constituency";
import paginationFactory from 'react-bootstrap-table2-paginator';
class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
        tableData: undefined,
        selectedIds: [],
        mapKeyId: {}
    }
}

componentDidMount() {
  axios.get('https://create-constituencies-default-rtdb.firebaseio.com/my.json').then(
      response => {
        let tmp = [];
        for(var i in response.data){
          tmp.push(response.data[i]);
        }
        console.log(response.data);
          this.setState({
            tableData: tmp
          });
      }
  ).catch(error => { this.setState((preState) => ({
    applicationError: true
  })) });
}

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

      handleOnSelect = (row, isSelect) => {

      }

      selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: this.handleOnSelect,
        hideSelectAll: true
      };

    render() {

      const options = {
        sizePerPage: 10,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true
      };

        return (
            <div>
                <h3 className="home-heading">Constituencies</h3>
                
                <BootstrapTable
                      pagination={ paginationFactory(options) }
                      selectRow={ this.selectRow }
                      noDataIndication="Table is Empty. Please create Constituencies from the create page."
                      hover
                      condensed
                      striped
                      keyField='Id'
                      data={ this.state.tableData ?this.state.tableData : [] }
                      columns={ this.columnsTotal }
                  />
            </div>
        );
    }
}

export default Home;