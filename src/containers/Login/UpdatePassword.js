import classes from './UpdatePassword.module.css';
import React from "react";
import AuthContext from '../../store/auth-context';
import {useHistory} from 'react-router-dom';

const UpdatePassword = () => {
  const history = useHistory();
  const authCtx = React.useContext(AuthContext);
  const newPasswordRef = React.useRef();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const updatedPassword = newPasswordRef.current.value;
    const url =  "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDkHjoK5YnUnTG9agufwMkN3B5EBmALsFE";
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: updatedPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
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
    }).then((data) => { console.log(data); history.replace('/');}).catch((err) => { alert(err) });
  }
  
  return (
    <section className={classes.auth}>
        <form onSubmit={onSubmitHandler} className={classes.form}>
        <div className={classes.control}>
            <label htmlFor='new-password'>New Password</label>
            <input ref={newPasswordRef} type='password' id='new-password' />
        </div>
        <div className={classes.action}>
            <button>Change Password</button>
        </div>
        </form>
    </section>
  );
}

export default UpdatePassword;
