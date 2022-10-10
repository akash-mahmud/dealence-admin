import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory, useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
function AddPlan() {
  const history = useHistory();
  const AcessToken = localStorage.getItem('use');
  useEffect(() => {
    const data = localStorage.getItem('use');
    console.log(JSON.parse(data));
    if (!data) {
      history.push('/employee/login');
    }
  }, [history]);
  const [err, seterr] = useState(false);
  const [message, setmessage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [plan, setplan] = useState('BIMONTHLY');
  const [amount, setamount] = useState(0.0);
  const { id } = useParams();

  const subMitHandel = async (e) => {
    console.log(typeof startDate);
    console.log(startDate);
    e.preventDefault();
    const { data } = await axios.post(
      `/ea/user/plan/create/${id}`,
      {
        startDate,
        amount,
        plan,
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
                <label>Select Plan</label>
                <select
                  onChange={(e) => setplan(e.target.value)}
                  className="form-control"
                >
                  <option value={'BIMONTHLY'}>BIMONTHLY</option>
                  <option value={'SEMIANNUAL'}>SEMIANNUAL</option>
                </select>
              </div>

              <div className="col">
                <label>Select date</label>
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
                <Alert
                  // variant="outlined"
                  severity="warning"
                >{`Note: If you add a past date which is more than the plan, then you will get your money in user dashboard after 1 day. Because our server refresh this in every day 3 am as it's shedule time. .
         `}</Alert>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-4">
                {/* {err ? <Alert severity="error">{message}</Alert> : ''} */}
                <Alert severity="info">{`Important: If you create a plan with pastdate and the date you have used and from current date, if the plan time is over, then you need to remeber that the money will invested again on the same plan, and our next payout section will start to displaying the new invested time line.
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

export default AddPlan;
