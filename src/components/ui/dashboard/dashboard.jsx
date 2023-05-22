import React from "react";
import { InputField } from '../../uitls/common/textfields'
import { setLogout } from "../../../redux/features/authSlice";

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Code } from 'react-feather'
import { getproductbyId } from '../../../redux/features/productSlice'
import './dashboard.css'


export const SORT = { ASC: 'asc', DESC: 'desc', UNSET: 'unset', NONE: 'none' }

export const TableHeader = (props) => {
  const [columnList, setColumnList] = useState([])

  useEffect(() => {
    setColumnList(props.columnList)
  }, [props.columnList])

  const onSortClick = (column) => {
    // Sorting
    let columnListLocal = [...columnList]
    // Extract current status
    const columnLocalSort = columnListLocal.find(item => item.name === column.name).sort
    // If none do not sort
    if (columnLocalSort === SORT.NONE) return
    // Set all to Unset
    columnListLocal = columnListLocal.map(item => ({
      ...item, sort: (item.sort === SORT.NONE ? SORT.NONE : SORT.UNSET)
    }))
    // Extract targetColumn
    const columnLocalIdx = columnListLocal.findIndex(item => item.name === column.name)
    // Modify state
    if (columnLocalSort === SORT.UNSET) columnListLocal[columnLocalIdx].sort = SORT.ASC
    else if (columnLocalSort === SORT.ASC) columnListLocal[columnLocalIdx].sort = SORT.DESC
    else columnListLocal[columnLocalIdx].sort = SORT.UNSET
    setColumnList([...columnListLocal])


    // Notify parent
    props.onSortClick(columnListLocal[columnLocalIdx])
  }

  return <thead>
    <tr>
      {columnList.map((item, idx) =>
        <td key={idx} style={{ width: item.width }}>
          <div className='d-flex cursor-pointer align-items-center justify-content-center' style={{ padding: '0 0.5em' }}
            onClick={() => onSortClick(item)}>
            <span style={{ marginRight: '0.5em' }}>{item.name}</span>
            {[SORT.ASC].includes(item.sort) ? <ChevronUp size={14} /> : null}
            {[SORT.DESC].includes(item.sort) ? <ChevronDown size={14} /> : null}
            {[SORT.UNSET].includes(item.sort) ? <Code size={14} /> : null}
          </div>
        </td>)}
    </tr>
  </thead>
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const [userEmail, setEmail] = useState('')
  const [inputValue, setInputValue] = useState({ productInput: "" });
  const productReduxState = useSelector(state => state.product?.products);
  const [productList, setProductList] = useState([])
  const { productInput } = inputValue;
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((previous_state) => ({
      ...previous_state,
      [name]: value,
    }));
    localStorage.setItem("params", value);
    dispatch(getproductbyId(value))
  };

  const handleLogout = () => {
    dispatch(setLogout())
    navigate('/');

  }
  const [headerList, setHeaderList] = useState([
    { name: 'ID', key: 'id', sort: SORT.UNSET, width: '1%' },
    { name: 'NAME', key: 'name', sort: SORT.UNSET, width: '2%' },
    { name: 'Description', key: 'product_desc', sort: SORT.UNSET, width: '2%' },
    { name: 'PRICE', key: 'price', sort: SORT.UNSET, width: '1%' },
    { name: 'STOCK', key: 'stock', sort: SORT.UNSET, width: '1%' },
    { name: 'Action', key: 'action', sort: SORT.UNSET, width: '5%' },
  ])

  const onSortClick = (column) => {
    if ([SORT.ASC, SORT.DESC].includes(column.sort)) {
      console.log(column);
      const sortedProduct = [...productList].sort((a, b) => {
        if (a[column.key] < b[column.key]) return column.sort === 'asc' ? -1 : 1;
        if (a[column.key] > b[column.key]) return column.sort === 'asc' ? 1 : -1;
        return 0;
      });

      setProductList(sortedProduct);


      return null
    }
    else
      return null
  }



  useEffect(() => {
    setEmail(localStorage.getItem("user_email"));
    let products = [];
    debugger;
    if (localStorage.getItem("params") && localStorage.getItem("allproduct")) {
      setInputValue({ productInput: localStorage.getItem("params") });
      products = JSON.parse(localStorage.getItem("allproduct"));
    }
    else {
      products = productReduxState;
    }
    if (products){
      const updatedProductList = products.map(product => {
        if (!product.hasOwnProperty('selected')) {
          return { ...product, 'selected': false };
        }
        return product;
      });
      setProductList(updatedProductList);
    }
    else{
      setProductList([]);
    }
    
  }, [productReduxState]);

  const handleAdd = (e) => {
    let products = JSON.parse(localStorage.getItem("allproduct"));
    products[e]['selected']=true;
    localStorage.setItem("allproduct", JSON.stringify(products));
    setProductList(products);
  };

  const handleRemove = (e) => {
    let products = JSON.parse(localStorage.getItem("allproduct"));
    products[e]['selected']=false;
    localStorage.setItem("allproduct", JSON.stringify(products));
    setProductList(products);
  };

  return (
    <div>
      <div style={{ background: '#7367f0' }} className="container-fluid p-2">
        <div className="row d-flex justify-content-end">
          <div className="user-text d-flex justify-content-end" >
            <div style={{ "padding-right": "2%" }}>{userEmail}</div>
            <div style={{ "padding-right": "2%" }}><button className='log-button' onClick={() => handleLogout()}>Logout</button></div>
          </div>
        </div>

      </div>
      <div className="App-header">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div style={{ color: 'black' }} className='text-center'><h1>Products List</h1></div>
            <div className="row">
              <div className="col-4">
                <InputField value={productInput} name="productInput" type="text" label={"Product Name"} placeholder="Name" onChange={handleChange} />
              </div>
            </div>
            <table className='w-100 product-table'>
              <TableHeader
                columnList={headerList}
                onSortClick={(item) => onSortClick(item)} />
              <tbody>

                {
                  productList?.length > 0 ? productList.map((item, idx) =>
                    <tr key={idx}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.price}</td>
                      <td>{item.stock}</td>
                      <td>{
                        item.selected ?
                          <button className="btn btn-success p-1"
                            onClick={(e) => handleRemove(idx)}
                            style={{ padding: 0 }}>
                            Remove
                          </button> :
                          <button className="btn btn-success p-1"
                            onClick={(e) => handleAdd(idx)}
                            style={{ padding: 0 }}>
                            Add to Cart
                          </button>}
                      </td>
                    </tr>) : <tr>
                    <td>NA</td>
                    <td>NA</td>
                    <td>NA</td>
                    <td>NA</td>
                    <td>NA</td>
                    <td>NA</td>

                  </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 