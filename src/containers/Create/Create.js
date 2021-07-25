import React, { Component } from 'react';
import Dimapur from "../../images/Dimapur.svg";
// import db from "../../DataStore/db";
import BootstrapTable from 'react-bootstrap-table-next';
import './Create.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Button} from "react-bootstrap";
import axios from "../../axios-constituency";
import {  Redirect } from "react-router-dom";
class Create extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dbData: undefined,
            tableData: [],
            villageIds: [],
            villageNames: [],
            totalVillages: 0,
            totalPopulation: 0,
            totalAoPopulation: 0,
            totalSemaPopulation: 0,
            totalTenyPopulation: 0,
            totalLothaPopulation: 0,
            totalOthers: 0,
            error: false,
            circle: undefined,
            applicationError: false,
            redirect: false
        }
    }

    componentDidMount() {
      axios.get('https://create-constituencies-default-rtdb.firebaseio.com/db.json').then(
          response => {
            console.log(response.data);
              this.setState({
                dbData: response.data
              });
          }
      ).catch(error => { this.setState((preState) => ({
        applicationError: true
      })) });
  }

  componentDidUpdate() {
    // axios.get('https://create-constituencies-default-rtdb.firebaseio.com/db.json').then(
    //       response => {
    //         console.log(response.data);
    //           this.setState({
    //             dbData: response.data
    //           });
    //       }
    //   ).catch(error => { this.setState((preState) => ({
    //     applicationError: true
    //   })) });
  }

    isValidSelectionInclusion = (row) => {
      let arr = [...this.state.villageIds, row["Id"]];
      let usedCircles =  new Set();
      let tmp = this.state.dbData.filter((ele)=> {
        return arr.includes(ele["Id"]);
      });
      tmp.forEach(ele => usedCircles.add(ele["Circle"]));
      return usedCircles.size <= 3;
    }

    isValidSelectionExclusion = (row) => {
      let arr = [...this.state.villageIds];
      const index = arr.indexOf(row["Id"]);
      if (index > -1) {
        arr.splice(index, 1);
      }
      let usedCircles =  new Set();
      let tmp = this.state.dbData.filter((ele)=> {
        return arr.includes(ele["Id"]);
      });
      tmp.forEach(ele => usedCircles.add(ele["Circle"]));
      return usedCircles.size <= 3;
    }

    returnNewIDs = (arr, id) => {
      let newArr = [...arr];
      const index = newArr.indexOf(id);
      if (index > -1) {
        newArr.splice(index, 1);
      }
      return newArr;
    }

    handleOnSelect = (row, isSelect) => {
      // console.log(row, isSelect);
      if (isSelect) {
        if(this.isValidSelectionInclusion(row)){
          this.setState((prevState) => ({
            villageIds: [...prevState.villageIds, row["Id"]],
            villageNames: [...prevState.villageNames, row["Location name"]],
            totalVillages: prevState.totalVillages + 1,
            totalPopulation: prevState.totalPopulation + parseInt(row["Total population"]),
            totalAoPopulation: prevState.totalAoPopulation + parseInt(row["Ao population"]),
            totalSemaPopulation: prevState.totalSemaPopulation + parseInt(row["Sema population"]),
            totalTenyPopulation: prevState.totalTenyPopulation + parseInt(row["Teny Population"]),
            totalLothaPopulation: prevState.totalLothaPopulation + parseInt(row["Lotha Population"]),
            totalOthers: prevState.totalOthers + parseInt(row["Others"])
          }));
        }
        else {
          this.setState((prevState) => ({
            error: true
          }));
          alert("You cannot select villages from more than 3 Circles for a Constituency!!");
          return false;
        }
        
      } else {
        this.setState((prevState) => ({
            villageIds: this.returnNewIDs(prevState.villageIds, row["Id"]),
            villageNames: this.returnNewIDs(prevState.villageNames, row["Id"]),
            totalVillages: prevState.totalVillages - 1,
            totalPopulation: prevState.totalPopulation - parseInt(row["Total population"]),
            totalAoPopulation: prevState.totalAoPopulation - parseInt(row["Ao population"]),
            totalSemaPopulation: prevState.totalSemaPopulation - parseInt(row["Sema population"]),
            totalTenyPopulation: prevState.totalTenyPopulation - parseInt(row["Teny Population"]),
            totalLothaPopulation: prevState.totalLothaPopulation - parseInt(row["Lotha Population"]),
            totalOthers: prevState.totalOthers - parseInt(row["Others"])
        }));
        if(this.isValidSelectionExclusion(row)){
          this.setState((prevState) => ({
            error: false
          }));
        }
      }
    }

    filterTableData = (cirle) => {
      if(this.state.dbData){
        const arr  = this.state.dbData.filter((ele) => {
            return ele["Circle"] === cirle && ele["isSelected"] === "FALSE";
        });
        arr.sort((ele1, ele2) => {
          return ele1["Location name"] > ele2["Location name"] ? 1 : ele1["Location name"] < ele2["Location name"] ? -1 : 0;
        });
        // console.log(arr);
        this.setState({tableData: [...arr], circle: cirle});
      }
        this.node.paginationContext.currPage = 1;
        
    }
    // CaptionEle = () => <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'purple', border: '1px solid purple', padding: '0.5em' }}>{this.state.captionElement}</h3>;

    columns = [{
        dataField: 'Location name',
        text: 'Village Name',
      }, {
        dataField: 'Total population',
        text: 'Total Population',
      }, {
        dataField: 'Ao population',
        text: 'Ao Population',
      },
      {
        dataField: 'Sema population',
        text: 'Sema Population',
      },
      {
        dataField: 'Teny Population',
        text: 'Teny Population',
      },
      {
        dataField: 'Lotha Population',
        text: 'Lotha Population',
      },
      {
        dataField: 'Others',
        text: 'Other Population',
      }];

    columnsTotal = [{
        dataField: 'Total Villages',
        text: 'Total Villages',
      }, {
        dataField: 'Total Population',
        text: 'Total Population',
      }, {
        dataField: 'Total Ao population',
        text: 'Total Ao Population',
      },
      {
        dataField: 'Total Sema population',
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

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: this.handleOnSelect,
        hideSelectAll: true
      };

      nextPath = (path) => {
        this.props.history.push(path);
      }

    render() {
      const options = {
        sizePerPage: 7,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true
      };

      if (this.state.redirect) {
        return <Redirect to='/home'/>;
      }

      async function updateAPI(url) {
        const response = await axios.patch(url, {"isSelected": "TRUE"});
        console.log(response)
        console.log(response.data)
      }
      const create = (event) => {
        event.preventDefault();
        let obj = {};
        obj["Id"] = Math.ceil(Math.random() * 1000000000000);
        obj["Name"] = event.target[0].value;
        obj["Total Villages"] = this.state.totalVillages;
        obj["Total Population"] = this.state.totalPopulation;
        obj["Total Ao Population"] = this.state.totalAoPopulation;
        obj["Total Sema Population"] = this.state.totalSemaPopulation;
        obj["Total Teny Population"] = this.state.totalTenyPopulation;
        obj["Total Lotha Population"] = this.state.totalLothaPopulation;
        obj["Total Others"] = this.state.totalOthers;
        obj["Villages Selected"] = this.state.villageIds;
        obj["Villages Name Selected"] = this.state.villageNames;

        // my.push(obj);
        let selectedVillages = [...this.state.villageIds];
        this.state.dbData.forEach((ele) => {
          if(selectedVillages.includes(ele["Id"])){
            var id = parseInt(ele["Id"])-1
            var url = "https://create-constituencies-default-rtdb.firebaseio.com/db/" + id.toString() + ".json/";
            updateAPI(url);
          }
        });

        axios.post('/my.json', obj).then(response => {
            console.log("Created Successfully");
            this.setState({redirect: true});
        }).catch(error => {
            //console.log(error);
            this.setState({ loading: false });
        });
      }

      const totalTableData = [
        {
          "Total Villages": this.state.totalVillages,
          "Total Population": this.state.totalPopulation,
          "Total Ao population": this.state.totalAoPopulation,
          "Total Sema population": this.state.totalSemaPopulation,
          "Total Teny Population": this.state.totalTenyPopulation,
          "Total Lotha Population": this.state.totalLothaPopulation,
          "Total Others": this.state.totalOthers
        }
      ];

        return (
          <>
            <div className = "float-container">
              <div className = "float-child map">
                <img alt="Dimapur-img" src={Dimapur} useMap="#image-map"/>
                <map name="image-map">
                    <area onClick={()=>this.filterTableData("Aghunaqa")} alt="Aghunaqa" title="Aghunaqa"  coords="261,247,268,240,278,235,285,228,288,219,289,209,292,201,297,192,305,183,311,177,316,166,319,156,326,150,334,148,342,149,349,148,357,145,365,142,372,140,384,140,385,146,385,154,377,159,372,165,371,170,373,175,377,179,377,186,375,191,374,200,370,207,363,216,357,221,355,228,352,234,350,239,351,243,346,250,346,256,342,262,337,266,329,270,321,273,315,276,308,276,294,256,283,255,269,255" shape="poly"/>
                    <area target="" onClick={()=>this.filterTableData("Niuland")} alt="Niuland" title="Niuland" coords="246,258,250,252,255,248,261,248,265,252,274,256,285,255,294,256,300,266,307,274,312,276,320,273,330,271,337,267,346,261,354,261,360,266,362,272,375,274,382,276,391,277,392,282,390,289,394,292,398,295,404,304,410,300,418,299,425,301,433,299,441,298,446,304,446,310,445,314,439,318,437,322,428,323,422,327,423,330,414,330,408,336,402,340,402,344,393,335,388,337,381,337,374,337,368,333,356,331,350,330,343,330,342,315,334,310,334,300,331,297,324,296,318,297,310,293,305,298,300,302,293,306,286,311,276,312,268,310,258,310,249,308,241,297,244,290,245,279,256,282,266,281,266,275,259,274,262,266" shape="poly"/>
                    <area target="" onClick={()=>this.filterTableData("Kuhuboto")}  alt="Kuhuboto" title="Kuhuboto" coords="250,309,259,311,266,309,274,311,281,313,290,309,295,305,302,301,310,295,318,297,332,297,335,311,343,318,342,324,344,330,338,338,334,343,330,349,321,350,310,351,303,352,297,356,299,364,305,366,313,368,318,370,322,372,322,382,319,383,313,379,305,377,296,375,289,376,282,382,279,393,271,394,263,393,265,377,252,373,249,364,256,354,257,345,254,335,252,324,252,318,250,312" shape="poly"/>
                    <area target="" onClick={()=>this.filterTableData("Chumukedima")} alt="Chumukedima" title="Chumukedima" coords="159,408,161,399,167,397,172,392,179,393,186,394,189,385,192,371,199,370,206,361,212,355,217,349,214,339,217,331,216,321,216,314,222,310,226,304,234,306,233,299,233,290,240,290,245,304,248,311,250,322,252,329,253,337,257,343,256,351,252,356,248,363,249,369,254,374,259,376,263,380,264,392,271,395,279,393,282,387,287,389,294,388,298,391,301,395,302,401,297,407,296,412,299,417,301,422,301,429,296,434,299,438,291,441,284,445,278,446,272,450,266,458,264,470,259,474,254,476,248,480,240,484,235,490,227,495,220,500,213,495,207,500,194,499,185,497,186,486,187,476,183,463,177,451,171,437,166,418" shape="poly"/>
                    <area  target="" onClick={()=>this.filterTableData("Dimapur Sadar")} alt="Dimapur Sadar" title="Dimapur Sadar" coords="162,346,171,338,178,339,184,332,189,334,196,331,201,331,207,328,209,321,218,322,215,332,213,338,216,350,208,348,211,356,200,363,195,371,190,379,187,392,180,390" shape="poly"/>
                    <area  target="" onClick={()=>this.filterTableData("Nihokhu")} alt="Nihokhu" title="Nihokhu" coords="281,385,286,379,293,377,299,377,306,378,315,382,321,384,320,372,309,368,297,364,296,357,304,352,317,351,330,350,335,339,344,329,358,333,367,333,371,338,382,338,392,336,399,344,403,349,408,354,419,354,420,361,423,365,419,370,413,376,406,379,397,384,388,393,378,401,367,409,356,416,342,420,337,425,323,429,314,433,297,437,302,425,295,412,300,405,302,396,295,388,287,389" shape="poly"/>
                    <area target="" onClick={()=>this.filterTableData("Dhansiripar")} alt="Dhansiripar" title="Dhansiripar" coords="159,409,165,419,168,428,171,438,174,447,180,458,183,467,187,478,185,487,184,495,187,499,194,500,206,502,208,508,205,515,203,522,205,531,209,535,213,539,220,552,213,550,206,549,200,546,195,539,190,533,180,538,175,542,164,540,158,542,153,530,148,534,140,528,137,520,132,516,128,523,118,529,107,527,101,528,95,531,85,536,82,530,76,524,71,517,71,508,62,504,48,505,42,496,47,488,55,486,55,484,62,478,65,471,66,468,76,471,80,461,88,465,91,459,95,453,106,454,106,448,109,439,115,438,114,430,120,425,125,418,138,413,149,413" shape="poly"/>
                    <area  target="" onClick={()=>this.filterTableData("Medziphema")} alt="Medziphema" title="Medziphema" coords="207,502,213,494,219,500,229,495,236,490,241,484,254,478,260,474,264,467,267,458,274,449,281,446,289,443,296,438,303,434,314,434,327,428,338,426,345,420,352,417,363,412,374,404,386,396,391,390,397,386,408,378,415,376,420,370,424,365,430,367,431,373,428,380,430,385,430,391,427,397,429,402,431,410,433,416,433,423,433,430,432,436,425,437,419,440,417,446,418,448,414,453,413,459,419,468,421,473,423,479,425,483,422,488,418,494,409,498,403,504,392,506,378,508,372,511,364,506,359,513,356,519,355,527,361,534,359,540,353,542,347,549,346,555,342,564,331,549,323,541,314,531,300,530,283,533,260,539,250,547,242,542,231,540,221,536,214,532,208,527,204,520" shape="poly"/>
                </map>
                </div>
                <div className = "float-child table">
                  {
                    this.state.circle && <h3> Selected Circle - {this.state.circle} </h3>
                  }
                  <BootstrapTable
                      tabIndexCell
                      pagination={ paginationFactory(options) }
                      ref={(n) => (this.node = n)}
                      noDataIndication="Table is Empty. Please select a Circle from the map on the left."
                      striped
                      hover
                      condensed
                      keyField='Id'
                      data={ this.state.tableData }
                      columns={ this.columns }
                      selectRow={ this.selectRow }
                  />
                  { this.state.villageIds.length > 0 &&
                  <form onSubmit={create}>
                    <div className="control">
                      <label htmlFor='name'>Constituency Name</label>
                      <input placeholder="Please enter a Constituency Name" required type='text' id='name' />
                    </div>
                    <BootstrapTable
                        noDataIndication="Table is Empty. Please select villages from the table."
                        hover
                        condensed
                        keyField='Id'
                        data={ totalTableData }
                        columns={ this.columnsTotal }
                    />
                    <div className="actions-btn">
                      <Button type="submit" variant="primary" disabled={this.state.villageIds.length === 0}>Create Constituency</Button>
                    </div>
                  </form>
                  }
                </div>
            </div>
          </>
        );
    }
}

export default Create;