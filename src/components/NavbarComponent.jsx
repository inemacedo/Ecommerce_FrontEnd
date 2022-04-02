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
  const params = useParams();

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/categories`
        );
        const data = await response.json();
        console.log(data);
        setCategories(data);
      } catch (error) {
        if (error.message === "Failed to fetch") {
          setCategories("Failed to fetch");
        }
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    setShowNav(false);
  }, [params]);

  const total = cart.reduce((acc, elem) => (acc += Number(elem.quantity)), 0);
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
                className="navbar-links m-0 mt-2 ms-xl-4 ms-xxl-5 p-4 "
                to="/"
              >
                Home
              </Link>
              <NavDropdown
                className="navbar-links m-0 ms-xl-4 mb-0 ms-xxl-5 p-4"
                title="Categorías"
                id="navbarScrollingDropdown"
              >
                {categories.map((category) => (
                  <NavDropdown.Item>
                    <NavLink
                      key={category.id}
                      to={`/categoria/${category.name}`}
                      className="text-decoration-none text-dark text-capitalize"
                    >
                      {category.name}
                    </NavLink>
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <NavLink
                    to={`/productos`}
                    className="text-decoration-none text-dark"
                  >
                    Ver todos los productos
                  </NavLink>
                </NavDropdown.Item>
              </NavDropdown>

              <Link
                className="navbar-links m-0 mt-2 ms-xl-4 ms-xxl-5 p-4 fw-bold sobre-nosotros"
                to="/sobre-nosotros"
              >
                Sobre nosotros
              </Link>
            </Nav>

            <Nav className="ms-auto mt-3 ">
              <Link className="navbar-links navbar-icon m-0 p-4" to="/registro">
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
                <span className="badge bg-dark ms-1">{total}</span>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarComponent;
