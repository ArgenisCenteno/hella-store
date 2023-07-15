import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import register from "./img/registro.png";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [shown, setShown] = React.useState(false);
  const switchShown = () => setShown(!shown);
  const onChange = ({ currentTarget }) => setPassword(currentTarget.value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  const navigate = useNavigate();

  // FUNCIÓN PARA EL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar nombre
    if (!name) {
      setNameError("El nombre es requerido");
      return;
    } else {
      setNameError("");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Ingrese un email válido");
      return;
    } else {
      setEmailError("");
    }

    // Validar password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      setPasswordError(
        "Clave insegura"
      );
      return;
    } else {
      setPasswordError("");
    }

    // Validar teléfono
    const phoneRegex = /^\d{11}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setPhoneError("Ingrese un número de teléfono válido");
      return;
    } else {
      setPhoneError("");
    }

    // Validar dirección
    if (!address) {
      setAddressError("La dirección es requerida");
      return;
    } else {
      setAddressError("");
    }

    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error");
    }
  };

  return (
    <Layout title="Registrar - Hella Store">
      <div className="content-wrapper m-0 contenido">
        <div className="content">
          <div className="row">
            <div className="col-lg-5 col-xs-5 col-sm-5">
              <div className="form-container  " style={{ minHeight: "100vh" }}>
                <form onSubmit={handleSubmit}>
                  <h4 className="title">Registrar</h4>
                  <div className="mb-3">
                    <label style={{ fontSize: "12px", marginBottom: "6px" }}>
                      <strong>Nombre Completo</strong>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Ingresa tu nombre"
                      required
                      autoFocus
                    />
                    {nameError && (
                      <small className="text-danger">{nameError}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label style={{ fontSize: "12px", marginBottom: "6px" }}>
                      <strong>Email</strong>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail2"
                      placeholder="Ingresa tu email"
                      required
                    />
                    {emailError && (
                      <small className="text-danger">{emailError}</small>
                    )}
                  </div>
                  <div className="mb-0 row">
                    <label style={{ fontSize: "12px", marginBottom: "6px" }}>
                      <strong>Clave</strong>
                    </label>
                    <div className="col-9">
                      <input
                        onChange={onChange}
                        type={shown ? "text" : "password"}
                        value={password}
                        className="form-control"
                        id="exampleInputPassword3"
                        placeholder="Ingresa tu clave"
                        required
                      />
                    </div>
                    <div className="col-3">
                      <button
                        type="button"
                        style={{
                          backgroundColor: "white",
                          padding: "4px",
                          border: "none",
                          color: "#059669",
                          marginBottom: "4px",
                        }}
                        className="mb-3 "
                        onClick={switchShown}
                      >
                        {shown ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    {passwordError && (
                      <small className="text-danger">{passwordError}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label style={{ fontSize: "12px", marginBottom: "6px" }}>
                      <strong>Telefono</strong>
                    </label>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail4"
                      placeholder="Ingresa tu telefono"
                      required
                    />
                    {phoneError && (
                      <small className="text-danger">{phoneError}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label style={{ fontSize: "12px", marginBottom: "6px" }}>
                      <strong>Dirección</strong>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail6"
                      placeholder="Ingresa tu dirección"
                      required
                    />
                    {addressError && (
                      <small className="text-danger">{addressError}</small>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary ingresar">
                    Registrar
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-5 col-xs-5 col-sm-5 imagen">
              <div className="container ">
                <img
                  src={register}
                  className="mt-6 pt-6 pl-0"
                  width="460px"
                  height="460"
                  alt="Imagen de registro"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;


