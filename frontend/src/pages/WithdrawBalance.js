import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
function WithdrawBalance() {
  const [err, seterr] = useState(false);
  const [message, setmessage] = useState('');
  const [amount, setamount] = useState(0.0);
        // const [startDate, setStartDate] = useState(new Date());
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
           `/ea/user/data/withdraw/balance/${id}`,
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
        <div className="row mt-4">
          <form>
            <div className="row">
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  onChange={(e) => setamount(e.target.value)}
                />
              </div>
              {/* <div className="col">
                <DatePicker
                  className=" form-control"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    // console.log(date);
                    // console.log(Date.now(date));
                    // console.log(new Date(date));
                    // console.log(new Date(date).getTime());
                    // console.log(new Date(date).getTime().toLocaleString());
                  }}
                />
              </div> */}
              <div className="col">
                <button
                  onClick={subMitHandel}
                  type="button"
                  className="btn btn-primary"
                >
                  Add
                </button>
                <button
                  onClick={() => history.push(`/employee/users/update/${id}`)}
                  style={{
                    marginLeft: '20px',
                  }}
                  type="button"
                  className="btn btn-danger"
                >
                  Back
                </button>

              </div>
            </div>
          </form>
        </div>
        <div className="row">
          <div className="col-md-6 mt-4">
            {err ? <Alert severity="error">{message}</Alert> : ''}
          </div>
        </div>
      </div>
    </>
  );
}

export default WithdrawBalance;
