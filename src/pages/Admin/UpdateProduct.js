import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [variations, setVariations] = useState([]);

  //OBTENER PRODUCTO
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
      setVariations(data.product.variations);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
     
  }, []);
  //OBTENER CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al traer las categorias");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //FUNCION PARA ACTUALIZAR PRODUCTO 
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("variations", JSON.stringify(variations)); // Convertir a formato JSON
  
      photo && productData.append("photo", photo);
  
      const { data } = axios.put(`/api/v1/product/update-product/${id}`, productData);
  
      if (data?.success) {
        toast.error(data?.message);
      } else { 
        navigate(`/dashboard/admin/products` );
        toast.success("Producto actualizado correctamente");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error inesperado");
    }
  };
   
  const addVariation = () => {
    const newVariation = { size: "", price: "", quantity: "" };
    setVariations([...variations, newVariation]);
  };
  
  const removeVariation = (index) => {
    const updatedVariations = [...variations];
    updatedVariations.splice(index, 1);
    setVariations(updatedVariations);
  };
  
  const handleVariationChange = (e, index, field) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = e.target.value;
    setVariations(updatedVariations);
  };
   
  
 
  //ELIMINAR PRODUCTO
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Estas seguro de querer eliminar este producto?");
      if (!answer) return;
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${id}`
      );
      toast.success("Producto eliminado correctamente");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Error inesperado");
    }
  };
  return (
    <Layout title={"Dashboard - Actualizar producto"}>
      <div className="container-fluid m-3 p-3 updateProduct"  >
        <div className="row">
          <div className="col-md-3 mt-8">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Actualizar Producto</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Seleccione una categoria"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Subir imagen"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Ingrese un nombre"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Ingrese una marca"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {variations.map((variation, index) => (
               <div key={index} className="row mb-3 d-flex justify-content-left">
                  <p> <strong>{`Talla ${variation.size}`}</strong> </p>
                  <div className="col-2 col-sm-1 "> 
                     <input
                       type="text"
                       value={variation.size}
                       placeholder="Ingrese la talla"
                       className="form-control"
                       onChange={(e) => handleVariationChange(e, index, "size")}
                      />
                  
               </div>
               <div className="col-4 col-sm-3 "> 
                   <input
                      type="number"
                      value={variation.price}
                      placeholder="Ingrese el precio"
                      className="form-control"
                       onChange={(e) => handleVariationChange(e, index, "price")}
                    />   
              </div>
              <div className="col-4 col-sm-3 "> 
                   <input
                    type="number"
                    value={variation.quantity}
                    placeholder="Ingrese la cantidad"
                   className="form-control"
                    onChange={(e) => handleVariationChange(e, index, "quantity")}
                   /> 
              </div>
              <div className="col-2 col-sm-1 "> 
                 <button className="btn btn-danger" onClick={() => removeVariation(index)}>
                 Remover
               </button> 
              </div>
           </div>
          ))}
  
        <div className="mb-3">
           <button className="btn btn-primary" onClick={addVariation}>
            Agregar Variación
          </button>
       </div>
               
              <div className="mb-3">
                <button className="btn btn-success" onClick={handleUpdate}>
                  Actualizar Producto
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Eliminar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
