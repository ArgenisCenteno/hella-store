import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import Modal from "react-modal";

const { Option } = Select;

const AdminOrders = () => {
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%", // Ajusta el ancho del modal según tus necesidades
      maxHeight: "80vh", // Ajusta la altura máxima del modal según tus necesidades
      overflow: "auto", // Habilita el desplazamiento si el contenido del modal es más largo
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Ajusta el color de fondo del overlay
      zIndex: 9999, // Ajusta el índice de apilamiento del overlay para que esté por encima de los elementos detrás del modal
    },
  };

  const [status, setStatus] = useState([
    "No procesada",
    "Procesada",
    "Enviada",
    "Recibida",
    "Cancelada",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  return (
    <Layout title={"Ordenes"}>
      <div className="row container-fluid m-3 p-3 dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Todas las ordenes</h1>
          {orders?.map((o, i) => (
            <div key={o?._id} className="border shadow mb-4">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Cliente</th> 
                      <th scope="col">Email</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Estado de pago</th>
                      <th scope="col">Monto</th>
                      <th scope="col">Variedades</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={s} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name} </td> 
                      <td>{o?.buyer?.email} </td>
                      <td> {o?.createdAt }</td>
                      <td>
                        {o?.payment.success ? "Pagada" : "Sin pagar"}
                      </td>
                      <td>{o?.payment?.transaction?.amount}</td>
                      <td>{o?.products?.length}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleViewOrder(o)}
                        >
                          Productos
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Orden"
        style={customModalStyles}
      >
        {selectedOrder && (
          <div>
            <h4 className="text-center">Detalles de la orden</h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Talla</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.size}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-success" onClick={closeModal}>Cerrar</button>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminOrders;
