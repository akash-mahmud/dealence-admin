import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useHistory , useParams } from 'react-router-dom';
import userServices from '../services/userServices'
import Pagination from '@material-ui/lab/Pagination';


function Plans() {

    const { id } = useParams();
    const history = useHistory();
    const AcessToken = localStorage.getItem('use');
     const [plans, setPlans] = useState([]);
 
     // useEffect(() => {
     // getUsers()
     // }, []) 
     console.log(plans);


       const getRequestParams = ( page, pageSize) => {
         let params = {};
 
         // if (searchTitle) {
         //   params['title'] = searchTitle;
         // }
 
         if (page) {
           params['page'] = page - 1;
         }
 
         if (pageSize) {
           params['size'] = pageSize;
         }
 
         return params;
       };
         const handlePageChange = (event, value) => {
           setPage(value);
         };
   const [page, setPage] = useState(1);
   const [count, setCount] = useState(0);
   const [pageSize, setPageSize] = useState(10);
     useEffect(() => {
       const data = localStorage.getItem('use');
       console.log(JSON.parse(data));
       if (!data) {
         history.push('/employee/login');
       }
     }, [history]);
   const retrieveTutorials = () => {
     const params = getRequestParams( page, pageSize);
 
     userServices
       .getAllPlans(params ,id )
       .then((response) => {
         const { increment, totalPages } = response.data;
 
         setPlans(increment);
         setCount(totalPages);
 
         console.log(response.data);
       })
       .catch((e) => {
         console.log(e);
       });
   };
 
   useEffect(retrieveTutorials, [page, pageSize]);
   const deleteData =  async(id) => {
console.log(id);
const {data} = await axios.delete(`/ea/users/verified/plan/delete/${id}` , {
  
    headers: {
      authorization: 'Bearer ' + JSON.parse(AcessToken).token,
    },
  
})
if(data ==='success'){
  retrieveTutorials()
}
   }  
  return (
    <>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-2">
            <button
              type="button"
              className="btn  btn-danger"
              style={{
                color: '#fff',
              }}
              onClick={() => history.push(`/employee/users/update/${id}`)}
            >
              Back
            </button>
          </div>
        
        

          <table class="table table-hover mt-4">
            <thead>
              <tr>
                <th scope="col">Started At</th>
                <th scope="col">Plan Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Actions</th>
     

              </tr>
            </thead>
            <tbody>
              {plans &&
                plans.map((currentUser, index) => (
                  <>
                    <tr>
                      <td>{`${new Date(currentUser.createdAt).toDateString()}`}</td>
                      <td>{currentUser.plan}</td>
                      <td>{currentUser.principal}</td>
                    
         
                      <td>
                        <button
                          type="button"
                          className="btn  btn-secondary"
                          style={{
                            color: '#fff',
                          }}
                          onClick={() =>deleteData(currentUser.id)
                         
                          }
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>

        <div className="row mt-4">
          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      </div>   
    </>
  )
}

export default Plans
