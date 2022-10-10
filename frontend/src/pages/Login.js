import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState();
  const history = useHistory();
  useEffect(() => {
    const data = localStorage.getItem('use');

    if (data) {
      history.push('/employee');
    }
  }, [history]);
  const [password, setpassword] = useState();

  const submit = async () => {
    const res = await axios.post('/ea/users/login', {
      email,
      password,
    });

    if (res.status === 200) {
      localStorage.setItem('use', JSON.stringify(res.data));
      window.location.reload()
      history.push('/employee');
    }
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="row">
          <div className="col-md-12">
            <form method="POST" className="mx-auto w-50 mt-5">
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form2Example1"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="form-label" htmlFor="form2Example1">
                  Email address
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form2Example2"
                  className="form-control"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <label className="form-label" htmlFor="form2Example2">
                  Password
                </label>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block mb-3 text-center"
                onClick={submit}
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
