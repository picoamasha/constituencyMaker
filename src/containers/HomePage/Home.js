import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import  "./Home.css";
import axios from "../../axios-constituency";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Button} from "react-bootstrap";
class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
        tableData: undefined,
        selectedIds: [],
        mapKeyId: {},
        applicationError: undefined
    }
}

transformTable = (data) => {
  let transformedData = [...data];
  let counter = 1;

  transformedData.forEach((obj)=>{
    obj["Number"] = counter;
    counter+=1;
  });

  return transformedData;
}

componentDidMount() {
  axios.get('https://create-constituencies-default-rtdb.firebaseio.com/my.json').then(
      response => {
        let tmp = [];
        let tmpMap = {};
        for(var i in response.data)
          tmp.push(response.data[i]);
        Object.keys(response.data).forEach((key)=>{
          tmpMap[response.data[key]["Id"]] = key;
        });
          this.setState({
            tableData: this.transformTable(tmp),
            mapKeyId: tmpMap
          });
        console.log(this.state.mapKeyId);
      }
  ).catch(error => { this.setState((preState) => ({
    applicationError: true
  })) });
}

    columnsTotal = [{
      dataField: 'Number',
      text: 'No.'
      },  
      {
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

      returnNewIDs = (arr, id) => {
        let newArr = [...arr];
        const index = newArr.indexOf(id);
        if (index > -1) {
          newArr.splice(index, 1);
        }
        return newArr;
      }

      handleOnSelect = (row, isSelect) => {
        if(isSelect){
          this.setState((prevState) => ({
            selectedIds: [...prevState.selectedIds, row["Id"]]
          }));
        }
        else{
          let newArr = [...this.state.selectedIds];
          const index = newArr.indexOf(row["Id"]);
          if (index > -1) {
            newArr.splice(index, 1);
          }
          this.setState((prevState) => ({
            selectedIds: newArr
          }));
        }
      }

      selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: this.handleOnSelect,
        hideSelectAll: true
      };

    render() {

      async function updateAPI(url) {
        const response = await axios.patch(url, {"isSelected": "FALSE"});
        console.log(response.data)
      }

      async function deleteAPI(url) {
        const response = await axios.delete(url);
        console.log(response)
        console.log(response.data)
      }

      const deleteData = () => {
        let arrIds = [...this.state.selectedIds];
        let villageIds = [];
        axios.get('https://create-constituencies-default-rtdb.firebaseio.com/my.json').then(
          response => {
            for(var i in response.data){
              if(arrIds.includes(response.data[i]["Id"])){
                villageIds = [...villageIds, ...response.data[i]["Villages Selected"]]
              }
            }
            console.log(villageIds);
            villageIds.forEach((ele)=>{
              let id = parseInt(ele)-1;
              var url = "https://create-constituencies-default-rtdb.firebaseio.com/db/" + id.toString() + ".json/";
              updateAPI(url);
            });

          }
        ).catch(error => { this.setState((preState) => ({
          applicationError: true
        })) });

        let mapKeyIds = {...this.state.mapKeyId};
        console.log(mapKeyIds);

        arrIds.forEach((id) => {
          var url = "https://create-constituencies-default-rtdb.firebaseio.com/my/" + mapKeyIds[id] + ".json";
          console.log(url);
          deleteAPI(url);
        });

        let oldTabData = [...this.state.tableData];
        let newTabData = [];
        oldTabData.forEach((obj)=>{
          if(!arrIds.includes(obj["Id"]))
            newTabData.push(obj);
        });
        this.setState((prevState)=> ({
          tableData: this.transformTable(newTabData),
          selectedIds: []
        }))
        // setTimeout(window.location.reload(), 2000);

      }

      const options = {
        sizePerPage: 8,
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
                  <div className="delete-btn">
                    <Button ariant="primary" onClick={()=>deleteData()} disabled={this.state.selectedIds.length === 0}>Delete Constituencies</Button>
                  </div>
            </div>
        );
    }
}

export default Home;