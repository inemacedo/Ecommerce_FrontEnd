import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { Link, NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as LogoHackHome } from "../icons/logohackhome.svg";

// si cambia el params cerrar la nav

function NavbarComponent() {
  const [categories, setCategories] = useState([]);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const params = useParams();

  const [showNav, setShowNav] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/categories`
        );
        if(response.status===200){
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
              <Link
                className="navbar-links m-0 ms-xl-4 ms-xxl-5 p-4 "
                to="/"
              >
                Home
              </Link>
              <NavDropdown
                className={`navbar-links m-0 ms-xl-4 mb-lg-0 ms-xxl-5 pointer d-flex flex-column align-items-center ${showNavDropdown?"mb-4":""}`}
                title="Productos"
                id="navbarScrollingDropdown"
                show={showNavDropdown}
                onToggle={()=>{
                  if(canToggle) setShowNavDropdown(prev=>!prev);
                  canToggle = false;
                  setTimeout(()=>{
                    canToggle = true;
                  }, 100);
                }}
              >
                {categories.map((category) => (
                  <Link key={category.id} 
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
                to="/sobre-nosotros"
              >
                Sobre nosotros
              </Link>
            </Nav>

            <Nav className="ms-auto ">
              <Link className="navbar-links navbar-icon m-0 p-4" to={user.token?"/profile":"/login"}>
                <AiOutlineUser size={20} />
              </Link>
              <Link className="navbar-links navbar-icon m-0 p-4" to="/search">
                <IoSearchOutline size={20} />
              </Link>
              <Link
                className="navbar-links navbar-icon m-0 p-4"
                to="/carrito-de-compras"
              >
                <BsCart2 size={20} />
                <span className="badge bg-dark ms-1">{cart.reduce( (acc, item)=> acc+=item.quantity , 0 )}</span>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarComponent;
