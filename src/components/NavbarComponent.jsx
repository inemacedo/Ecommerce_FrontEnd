import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Overlay,
  Popover,
} from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { Link, NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as LogoHackHome } from "../icons/logohackhome.svg";

// si cambia el params cerrar la nav

function NavbarComponent() {
  const [categories, setCategories] = useState([]);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch({ type: "REMOVE_CART" });
    dispatch({ type: "LOGOUT" });
  };

  const [showPopover, setShowPopover] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClickPopover = (event) => {
    setShowPopover(!showPopover);
    setTarget(event.target);
  };

  const [showNav, setShowNav] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);

  const totalItems = cart.reduce((acc, product) => acc + product.quantity, 0);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/categories`
        );
        if (response.status === 200) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        if (error.message === "Failed to fetch") {
          setCategories("Failed to fetch");
        }
      }
    };
    getCategories();
  }, []);

  let canToggle = true;

  useEffect(() => {
    setShowNavDropdown(false);
    setShowNav(false);
  }, [params]);

  return (
    <div>
      <Navbar
        bg="white"
        expand="lg"
        className="border"
        expanded={showNav}
        onToggle={() => setShowNav((prev) => !prev)}
      >
        <Container>
          <Link to="/" className="text-decoration-none">
            <Navbar.Brand className="g-0" id="navbar-text-logo">
              <LogoHackHome
                className="mb-1 me-2"
                style={{ height: "2.2rem" }}
              />
              HACK HOME
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Link className="navbar-links m-0 ms-xl-4 ms-xxl-5 p-4 " to="/">
                Home
              </Link>
              <NavDropdown
                className={`navbar-links m-0 ms-xl-4 mb-lg-0 ms-xxl-5 pointer d-flex flex-column align-items-center ${showNavDropdown ? "mb-4" : ""
                  }`}
                title="Productos"
                id="navbarScrollingDropdown"
                show={showNavDropdown}
                onToggle={() => {
                  if (canToggle) setShowNavDropdown((prev) => !prev);
                  canToggle = false;
                  setTimeout(() => {
                    canToggle = true;
                  }, 100);
                }}
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categoria/${category.name}`}
                    className="text-decoration-none text-dark dropdown-item text-capitalize mb-2"
                  >
                    {category.name}
                  </Link>
                ))}
                <NavDropdown.Divider />
                <Link
                  to={`/productos`}
                  className="text-decoration-none text-dark dropdown-item text-capitalize"
                >
                  Ver todos los productos
                </Link>
              </NavDropdown>

              <Link
                className="navbar-links m-0 ms-xl-4 ms-xxl-5 p-4 fw-bold sobre-nosotros"
                to="/sobre-este-proyecto"
              >
                Sobre este proyecto
              </Link>
            </Nav>

            <Nav className="ms-auto ">
              <div className="text-center" ref={ref}>
                <button
                  onClick={handleClickPopover}
                  type="button"
                  className="navbar-links navbar-icon m-0 p-4 bg-white border-0 text-center"

                /* to={user.token ? "/mi-perfil" : "/login"} */
                >
                  <AiOutlineUser size={20} />
                </button>
                {user.token ? (
                  <Overlay
                    show={showPopover}
                    target={target}
                    placement="bottom"
                    container={ref}
                    containerPadding={20}
                  >
                    <Popover id="popover-contained">
                      <Popover.Header as="h3">
                        Hola {user.user.firstname}!
                      </Popover.Header>
                      <Popover.Body className="d-flex flex-column">
                        <Link
                          className="text-dark text-decoration-none"
                          to="/mi-perfil"
                        >
                          Mi perfil
                        </Link>
                        <Link
                          to="/mis-compras"
                          className="text-decoration-none text-dark mt-2"
                        >
                          Mis compras
                        </Link>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={handleLogout}
                          className="text-decoration-none mt-2 text-danger"
                        >
                          Cerrar sesión
                        </div>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                ) : (
                  <Overlay
                    show={showPopover}
                    target={target}
                    placement="bottom"
                    container={ref}
                    containerPadding={20}
                  >
                    <Popover id="popover-contained">
                      <Popover.Header as="h3">Iniciar sesión</Popover.Header>
                      <Popover.Body className="d-flex flex-column">
                        <Link className="btn btn-outline-dark " to="/login">
                          Login
                        </Link>
                        <span className="mt-3">No estás registrado? </span>
                        <Link to="/registro" className="text-dark">
                          Create una cuenta!{" "}
                        </Link>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                )}
              </div>

              <Link className="navbar-links navbar-icon m-0 p-4" to="/search">
                <IoSearchOutline size={20} />
              </Link>
              <Link
                className="navbar-links navbar-icon m-0 p-4"
                to="/carrito-de-compras"
              >
                <BsCart2 size={20} />
                <span className="badge bg-dark ms-1">{totalItems}</span>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarComponent;
