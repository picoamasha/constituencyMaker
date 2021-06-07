import React from 'react'
import Alert from 'react-popup-alert'

const AlertNotification = (props) => {
  const [alert, setAlert] = React.useState({
    type: 'error',
    text: 'You cannot select more than three circles for creating a Constituency',
    show: false
  });

  function onCloseAlert() {
    setAlert({
      type: '',
      text: '',
      show: false
    })
  }

  return (
    <div>
      <Alert
        header={'Header'}
        btnText={'Close'}
        text={alert.text}
        type={alert.type}
        show={props.show}
        onClosePress={onCloseAlert}
        pressCloseOnOutsideClick={true}
        showBorderBottom={true}
        alertStyles={{}}
        headerStyles={{}}
        textStyles={{}}
        buttonStyles={{}}
      />
    </div>
  )
}

export default AlertNotification;
