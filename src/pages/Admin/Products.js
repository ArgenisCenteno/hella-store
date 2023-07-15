import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row container-fluid m-3 p-3 dashboard ">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-8">
          <h1>Todos los productos</h1>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th style={{width: "80px"}} >Imagen</th>
                  <th style={{width: "80px"}}>Nombre</th>
                  <th style={{width: "80px"}}>Marca</th>
                  <th style={{width: "80px"}} >Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((p) => (
                  <tr key={p._id}>
                    <td style={{width: "80px"}}>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        height={"200px"}
                        className="card-img-top"
                        alt={p.name}
                      />
                    </td>
                    <td style={{width: "80px"}}>{p.name}</td>
                    <td style={{width: "80px"}}>{p.description}</td>
                    <td style={{width: "80px"}}>
                      <Link
                        to={`/dashboard/admin/product/${p.slug}`}
                        className="product-link"
                      >
                        <button className="btn btn-primary">Ver</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;