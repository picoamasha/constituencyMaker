import {  useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from "react-router-dom";
import classes from './LoginForm.module.css';

const LoginForm = () => {

  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const tmpEmail = eMailRef.current.value;
    const enteredEMail = tmpEmail + "@gmail.com";
    const enteredPassword = passwordRef.current.value;

    const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDkHjoK5YnUnTG9agufwMkN3B5EBmALsFE";
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEMail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(res => {
        if(res.ok){
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMessage  = "Authentication Error";
            if(data && data.error && data.error.message)
              errorMessage = data.error.message;
            throw new Error(errorMessage);
          });
        }
      }).then((data) => { 
          console.log(data); 
          const expirationTime = new Date( new Date().getTime() + (+data.expiresIn)*1000 );
          authCtx.login(data.idToken, expirationTime.toISOString()); 
          history.replace("/home");  })
        .catch((err) => { console.log(err) });
  };

  const eMailRef = useRef();
  const passwordRef = useRef();

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label  htmlFor='email'>Username</label>
          <input ref={eMailRef} type='text' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Password</label>
          <input  minLength="7" ref={passwordRef} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          <button>Login</button>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
