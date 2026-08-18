function App() {
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith("/admin");

  // ============================================
  // SCROLL TO TOP ON EVERY PAGE CHANGE
  // ============================================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>

        {/* your routes */}

      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}