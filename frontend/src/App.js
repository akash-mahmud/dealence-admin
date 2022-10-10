import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import AddPayOutDirect from './pages/AddPayOutDirect';
import AddPlan from './pages/AddPlan';
import AddTransaction from './pages/AddTransaction';
import AllUsers from './pages/AllUsers';
import DecreaseBalance from './pages/DecreaseBalance';
import DecreasePayout from './pages/DecreasePayout';
import Home from './pages/Home';
import Login from './pages/Login';
import UpdatePlan from './pages/UpdatePlan';
import UpdateUser from './pages/UpdateUser';
import WithdrawBalance from './pages/WithdrawBalance';
import WithdrawPayout from './pages/WithdrawPayout';
import Plans from './pages/Plans';
function App() {
 
  return (
    <>
      <Switch>
        <Route exact={true} path="/employee">
          <Home />
        </Route>
        <Route exact={true} path="/employee/login">
          <Login />
        </Route>
        <Route exact={true} path="/employee/users">
          <AllUsers />
        </Route>
        <Route exact={true} path="/employee/user/addplan/:id">
          <AddPlan />
        </Route>
        <Route exact={true} path="/employee/user/updatePlan/:id">
          <UpdatePlan />
        </Route>
        <Route exact={true} path="/employee/users/update/:id">
          <UpdateUser />
        </Route>
  <Route exact={true} path="/employee/users/plans/:id">
          <Plans />
        </Route>
        <Route exact={true} path="/employee/users/add/payout/direct/:id">
          <AddPayOutDirect />
        </Route>
        <Route exact={true} path="/employee/users/wthdraw/balance/:id">
          <WithdrawBalance />
        </Route>
        <Route exact={true} path="/employee/users/decrease/balance/:id">
          <DecreaseBalance />
        </Route>
        <Route exact={true} path="/employee/users/decrease/payout/:id">
          <DecreasePayout />
        </Route>
        <Route exact={true} path="/employee/users/wthdraw/payout/:id">
          <WithdrawPayout />
        </Route>
        <Route exact={true} path="/employee/users/add/transaction/:id">
          <AddTransaction />
        </Route>
        <Route path="*">
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default App;
