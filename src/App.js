import Home from "./containers/HomePage/Home";
import Create from "./containers/Create/Create";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect 
} from "react-router-dom";
import AuthContext from "./store/auth-context";
import LoginForm from "./containers/Login/LoginForm";
import NotFound from "./components/NotFound";
import UpdatePassword from "./containers/Login/UpdatePassword";

function App() {

  const authCtx = React.useContext(AuthContext);
 
  const logoutHandler = () => {
    authCtx.logout();
  }

  return (
    <Router>
      { authCtx.isLoggedIn && 
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
        <Nav>
        <NavDropdown title="Logged In as Admin" id="collasible-nav-dropdown">
          <NavDropdown.Item href="/updatePassword">Change Password</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
      </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    }
        <Switch>
          { !authCtx.isLoggedIn && 
              <Route path='/auth'>
                <LoginForm />
              </Route>
          }
          <Route exact path="/">
            {authCtx.isLoggedIn &&  <Home /> }
            {!authCtx.isLoggedIn && <LoginForm/>}
          </Route>
          <Route exact path="/home">
            {authCtx.isLoggedIn && <Home />}
            {!authCtx.isLoggedIn && <Redirect to ="/auth"/>}
          </Route>
          <Route exact path="/updatePassword">
            {authCtx.isLoggedIn && <UpdatePassword />}
            {!authCtx.isLoggedIn && <Redirect to ="/auth"/>}
          </Route>
          <Route path="/create">
            {authCtx.isLoggedIn && <Create />}
            {!authCtx.isLoggedIn && <Redirect to ="/auth"/>}
          </Route>
          <Route path="*">
            <NotFound/>
          </Route>
        </Switch>
  </Router>
  );
}

export default App;
