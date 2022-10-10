import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useHistory } from 'react-router-dom';

function Home() {
  const [users, setUsers] = useState([]);

  const history = useHistory();
      const AcessToken = localStorage.getItem('use');
  useEffect(() => {
    const data = localStorage.getItem('use');

    if (!data) {
      history.push('/employee/login');
    } 
  }, [history]);
  const getUsers = async () => {
    const { data } = await axios.get('/ea/users', {
      headers: {
        authorization: 'Bearer ' + JSON.parse(AcessToken).token,
      },
    });
    setUsers(data);
  };
  useEffect(() => {
    getUsers();
  }, []);

  const approve = async (id) => {
    console.log(id);
    const { data } = await axios.post(
      `/ea/users`,
      { id: id },
      {
        headers: {
          authorization: 'Bearer ' + JSON.parse(AcessToken).token,
        },
      }
    );
      getUsers();
  };
  const discard = async (id) => {
    console.log(id);
    const { data } = await axios.post(
      `/ea/users/discard`,
      { id: id },
      {
        headers: {
          authorization: 'Bearer ' + JSON.parse(AcessToken).token,
        },
      }
    );
  };

  const logout = () => {
  localStorage.removeItem('use')
  history.push('/employee/login');
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-10"></div>

          <div className="col-md-2 mt-2 mb-3">
            <button className="btn btn-danger " onClick={logout}>
              Logout
            </button>
          </div>
          <div className="col-md-2 mb-3">
            <button
              className="btn btn-primary mb-2"
              onClick={() => history.push('/employee/users')}
            >
              All Users
            </button>
          </div>
          <div className="col-md-12">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Users Full Name</th>
                  <th scope="col">User Email</th>
                  <th scope="col">User Phone</th>
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Zip</th>
                  <th scope="col">Country</th>
                  <th scope="col">Address</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <>
                      <tr>
                        <td>
                          {user.first_name} {user.last_name}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone_number}</td>
                        <td>{user.city}</td>
                        <td>{user.state}</td>
                        <td>{user.zip}</td>
                        <td>{user.country}</td>
                        <td>{user.address}</td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => approve(user.id)}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => discard(user.id)}
                            type="button"
                            className="btn btn-danger mx-3"
                          >
                            Discard
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
