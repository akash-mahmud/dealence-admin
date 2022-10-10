import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';

function AddPayOutDirect() {
    const [err, seterr] = useState(false);
    const [message, setmessage] = useState('');
          const [amount, setamount] = useState(0.0);
                 const { id } = useParams();
                           const history = useHistory();
                           const AcessToken = localStorage.getItem('use');
                           useEffect(() => {
                             const data = localStorage.getItem('use');
                             console.log(JSON.parse(data));
                             if (!data) {
                               history.push('/employee/login');
                             }
                           }, [history]);

            const subMitHandel = async (e) => {
              e.preventDefault();
              const { data } = await axios.post(
                `/ea/user/data/add/payout/direct/${id}`,
                {
                  amount,
                },
                {
                  headers: {
                    authorization: 'Bearer ' + JSON.parse(AcessToken).token,
                  },
                }
              );
              console.log(data);

              if (data === 'success') {
                history.push(`/employee/users/update/${id}`);
              } else {
                seterr(true);
                setmessage(data);
              }
            };           
      
  return (
    <>
      <div className="container">
        <div className="row">
          <form className="mt-4">
            <div className="row">
              <div className="col">
                <label>Amount</label>
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => setamount(e.target.value)}
                />
              </div>

              <div className="col">
                <button
                  onClick={subMitHandel}
                  type="button"
                  className="btn btn-primary mt-4"
                >
                  Add
                </button>
                <button
                  onClick={() => history.push(`/employee/users/update/${id}`)}
                  style={{
                    marginLeft: '20px',
                  }}
                  type="button"
                  className="btn btn-danger mt-4"
                >
                  Back
                </button>
              </div>
            </div>
          </form>
        </div>
        {!err ? (
          <>
            <div className="row">
              <div className="col-md-6 mt-4">
                {/* {err ? <Alert severity="error">{message}</Alert> : ''} */}
                <Alert severity="warning">{`Note: This amount will automatically include with an user's existing available credit and in Payout. So this amount don't need any time. After add this user will start seeing this money on their available credits and they can request for withdraw.
         `}</Alert>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-4">
                {/* {err ? <Alert severity="error">{message}</Alert> : ''} */}
                <Alert severity="info">{`Important: If you wanna get a payout & available credit in a sytematic way and also which will calculated by his plan. leave this page and add plan with past date for this user.
         `}</Alert>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        <div className="row">
          <div className="col-md-6 mt-4">
            {err ? <Alert severity="error">{message}</Alert> : ''}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPayOutDirect