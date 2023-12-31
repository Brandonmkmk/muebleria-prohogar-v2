import "./manageProducts.css"
import { Button, Table } from "react-bootstrap"
import React,{ useContext, useRef } from "react"
import { productsContext } from "../../../context/productsContext"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SideBar from "../../common/sideBar/SideBar.js"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { FORMADDPRODUCTS } from "../../../config/routes/path.js"
const MySwal = withReactContent(Swal)

const ManageProducts = ()=>{
    const [searchProduct,setSearchProduct] = useState('')
    const [isLoading,setIsLoading] = useState(true)
    const {getProductsOnSale,listProductsOnSale,deleteProductsOnSale,filterProductsName} = useContext(productsContext)
    const navigate = useNavigate()
    const inputProduct = useRef()

    useEffect(()=>{
      const loadProductsOnSale = async()=>{
        await getProductsOnSale()
        setIsLoading(false)
      }
      loadProductsOnSale()
    },[])

    useEffect(()=>{
    if (!isLoading&&listProductsOnSale.length === 0){
       showAlert()
    }
    },[isLoading])

    const showAlert = async()=>{
      const result = await MySwal.fire({
        title:"No hay productos",
        icon:"error",
        showCancelButton:true,
        confirmButtonText:"Agregar nuevo producto",
        cancelButtonText:"Cerrar"
      })
      /*si result en su propiedad isConfirmed es true, quiere decir que se dio
      click en el confirmButton */
      if(result.isConfirmed){
        navigate(FORMADDPRODUCTS)
      }
    }

   
 const orderProductsByDate = listProductsOnSale.sort((a,b)=>new Date(b.date)- new Date(a.date))


return (
        <>
        <div className="container-grids">
    <div div className="grid-sidebars">
      <SideBar/>
      </div>
      <div className="grid-products">
        <h3 style={{textAlign:"center",marginTop:"50px"}}>Buscar productos</h3>
        <div className="search-product">
          <input ref={inputProduct} type="text" placeholder="Busca un producto en especifico" onChange={(e)=>{
            /*Todo lo que escribamos en el input se convertia a minusculas*/ 
            setSearchProduct(e.target.value)
          }}/>
          <Button variant="warning" className="btn-search-product" onClick={()=>{
             filterProductsName(searchProduct)
             inputProduct.current.value = ''
          }}>Buscar</Button>
        </div>
        <Table striped bordered hover size="sm" style={{marginTop:"30px"}}>
      <thead>
        <tr>
          
          <th>Producto</th>
          <th>Precio</th>
          <th>Descripcion</th>
          <th>Disponibles</th>
          <th>Categoria</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
       {orderProductsByDate.map((product)=>(
        <tr key={product._id}>
        <td>{`${product.name}`.toLowerCase()}</td>
        <td>{product.price}</td>
        <td>{product.description}</td>
        <td>{product.stock}</td>
        <td>{product.category}</td>
        <td>{new Date(product.date).toLocaleDateString()}</td>
        <td style={{display:"flex",gap:"5px"}}>
            <Button variant="light" style={{border:"2px solid orange"}} onClick={async()=>{
            await deleteProductsOnSale(product._id)
            }}>Eliminar</Button>
            <Button style={{color:"#ffffff"}} variant="warning" onClick={()=>{
            navigate(`/manageProducts/${product._id}`)
        }}>Editar</Button>
        </td>
       
        </tr>
       ))}
        
      </tbody>
    </Table>
      </div>
    
        </div>
        
        </>
    )
}   
export default ManageProducts