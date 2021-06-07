import Home from "./containers/HomePage/Home";
import Create from "./containers/Create/Create";
import { Navbar, Nav } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link > 
            <Link to="/home" style={{color: 'black'}}>Home</Link> 
          </Nav.Link>
          <Nav.Link >
            <Link to="/create" style={{color: 'black'}} >Create</Link> 
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Switch>
          <Route exact path="/" component={Home}>
          </Route>
          <Route exact path="/home" component={Home}>
          </Route>
          <Route path="/create"component={Create}>
          </Route>
        </Switch>
  </Router>
  );
}

export default App;
