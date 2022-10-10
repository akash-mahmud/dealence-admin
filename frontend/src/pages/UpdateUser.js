import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
      import Alert from '@material-ui/lab/Alert';
      
function UpdateUser() {
   const AcessToken = localStorage.getItem('use');
  const { id } = useParams();
  const history = useHistory();
  const [users, setUsers] = useState({});
  const [err, seterr] = useState(false);
  const [success, setsuccess] = useState(false)
  const [message, setmessage] = useState('');
  const [invest, setInvest] = useState(null);
    useEffect(() => {
      const data = localStorage.getItem('use');
      console.log(JSON.parse(data));
      if (!data) {
        history.push('/employee/login');
      }
    }, [history]);
  const getUser = async () => {
    const { data } = await axios.get(`/ea/users/verified/${id}`, {
      headers: {
        authorization: 'Bearer ' + JSON.parse(AcessToken).token,
      },
    });
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      state,
      zip,
      country,
    } = data[0];
    setUsers({
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      state,
      zip,
      country,
    });
  };
  const [data, setdata] = useState()
  const getAcountCredentialsData = async () => {
        const acountData = await axios.get(`/ea/user/account/${id}`, {
          headers: {
            authorization: 'Bearer ' + JSON.parse(AcessToken).token,
          },
        });

    console.log(acountData);
    setdata(acountData.data);
  }

  const getData = async () => {
    const investData = await axios.get(
      `/ea/user/investment/list/${id}`,
      {
        headers: {
          authorization: 'Bearer ' + JSON.parse(AcessToken).token,
        },
      },
    );

    setInvest(investData.data);
  };

  useEffect(() => {
    getUser();
    getData();
    getAcountCredentialsData();
  }, []);

  const submitData = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      `/ea/user/update/details/${id}`,
      {
        ...users,
      },
      {
        headers: {
          authorization: 'Bearer ' + JSON.parse(AcessToken).token,
        },
      }
    );
    console.log(data);
    // success;

    if (data === 'success') {
setsuccess(true);
setmessage(data);
    } else {
seterr(true);
setmessage(data);
    }
  };
   
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="justify-content-center mt-3">
            <div>
              <button
                onClick={() =>
                  history.push(`/employee/users/add/transaction/${id}`)
                }
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-primary ml-3"
              >
                Add a Transaction
              </button>
              <button
                onClick={() =>
                  history.push(`/employee/users/add/payout/direct/${id}`)
                }
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-primary ml-3"
              >
                Add Available Credit
              </button>
              <button
                onClick={() =>
                  history.push(`/employee/users/wthdraw/balance/${id}`)
                }
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-primary ml-3"
              >
                Withdraw from Available funds
              </button>
              <button
                onClick={() =>
                  history.push(`/employee/users/wthdraw/payout/${id}`)
                }
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-primary ml-3"
              >
                Withdraw from Available Credit
              </button>
              <button
                onClick={() =>
                  history.push(`/employee/users/decrease/balance/${id}`)
                }
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-secondary ml-3"
              >
                Decrease Balance
              </button>

              <button
                onClick={() =>
                  history.push(`/employee/users/decrease/payout/${id}`)
                }
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-info ml-3"
              >
                Decrease Available Credit
              </button>
              {invest === '' && (
                <button
                  onClick={() => history.push(`/employee/user/addplan/${id}`)}
                  style={{
                    marginRight: '20px',
                  }}
                  type="button"
                  className="btn btn-warning"
                >
                  Add Plan
                </button>
              )}
              {invest && (
                <button
                  onClick={() =>
                    history.push(`/employee/user/updatePlan/${id}`)
                  }
                  style={{
                    marginRight: '20px',
                  }}
                  type="button"
                  className="btn btn-warning mt-3 mb-3"
                >
                  Add Plan
                </button>
              )}

 <button
                  onClick={() =>
                    history.push(`/employee/users/plans/${id}`)
                  }
                  style={{
                    marginRight: '20px',
                  }}
                  type="button"
                  className="btn btn-info"
                >
                  All Plans
                </button>

              <button
                onClick={() => history.push(`/employee/users`)}
                style={{
                  marginRight: '20px',
                }}
                type="button"
                className="btn btn-danger mt-3 mb-3"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <h3>Balance: {data && data.balance && data.balance}€</h3>
          <h3>Available Credit: {data && data.credit && data.credit}€</h3>
          <form>
            <div className="form-row mt-4">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">First Name</label>
                <input
                  type="text"
                  value={users.first_name}
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      first_name: e.target.value,
                    })
                  }
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
            </div>

            <div className="form-row mt-4">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Last Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setUsers({
                      ...users,
                      last_name: e.target.value,
                    });
                  }}
                  value={users.last_name}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
            </div>

            <div className="form-row mt-4">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Email</label>
                <input
                  type="email"
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      email: e.target.value,
                    })
                  }
                  value={users.email}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
            </div>
            <div className="form-row mt-4">
              <div className="form-group col-md-6 mt-4">
                <label htmlFor="inputAddress">phone Number</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      phone_number: e.target.value,
                    })
                  }
                  value={users.phone_number}
                  className="form-control"
                  id="inputAddress"
                />
              </div>
            </div>

            <div className="form-row mt-4">
              <div className="form-group col-md-6  mt-4">
                <label htmlFor="inputAddress2">Address </label>
                <input
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      address: e.target.value,
                    })
                  }
                  type="text"
                  className="form-control"
                  id="inputAddress2"
                  value={users.address}
                />
              </div>
            </div>
            <div className="form-row mt-4">
              <div className="form-group col-md-6  mt-4">
                <label htmlFor="inputAddress2">city </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      city: e.target.value,
                    })
                  }
                  className="form-control"
                  id="inputAddress2"
                  value={users.city}
                />
              </div>
            </div>
            <div className="form-row mt-4">
              <div className="form-group col-md-6  mt-4">
                <label htmlFor="inputAddress2">state </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      state: e.target.value,
                    })
                  }
                  className="form-control"
                  id="inputAddress2"
                  value={users.state}
                />
              </div>
            </div>
            <div className="form-row mt-4">
              <div className="form-group col-md-6  mt-4">
                <label htmlFor="inputAddress2">country </label>
                <input
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      country: e.target.value,
                    })
                  }
                  type="text"
                  className="form-control"
                  id="inputAddress2"
                  value={users.country}
                />
              </div>
            </div>
            <div className="form-row mt-4">
              <div className="form-group col-md-6  mt-4">
                <label htmlFor="inputAddress2">Zip </label>
                <input
                  onChange={(e) =>
                    setUsers({
                      ...users,
                      zip: e.target.value,
                    })
                  }
                  type="text"
                  className="form-control"
                  id="inputAddress2"
                  value={users.zip}
                />
              </div>
            </div>
            <button
              onClick={submitData}
              type="submit"
              className="btn btn-primary mt-4"
            >
              Update
            </button>
          </form>
        </div>
        <div className="row">
          <div className="col-md-6 mt-4">
            {err ? <Alert severity="error">{message}</Alert> : ''}
            {success ? <Alert severity="success">{message}</Alert> : ''}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateUser;
