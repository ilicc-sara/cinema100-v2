import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

function Nav() {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigate = useNavigate();

  const [user, setUser] = useState<string>("Guest");

  useEffect(() => {
    const token = localStorage.getItem("sb-yyocycmzxqjdvkwqlpzd-auth-token");
    if (token) {
      const findUser = async () => {
        const { error, data } = await supabase
          .from("users")
          .select()
          .eq("email", JSON.parse(token).user.email)
          .single();

        setUser(data.name);

        if (error) {
          console.error(error);
        }
      };

      findUser();
    } else {
      console.error();
      navigate("/login");
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      setUser("Guest");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <nav className="bg-brand-midnight flex justify-between items-center mobile:!px-20 max-mobile:!px-10 !py-3">
      <Link to="/">
        <div className="w-[fit-content] flex justify-center items-center mobile:gap-2 max-mobile:gap-1">
          <img
            className="mobile:w-10 mobile:h-10 max-mobile:w-9 max-mobile:w-9"
            src="logo.png"
          />
          <h1 className="text-white font-medium tablet:text-xl mobile:text-lg max-mobile:hidden">
            cinema 100
          </h1>
        </div>
      </Link>

      <div className="text-[#e8f0fe] mobile:text-lg max-mobile:text-base font-medium flex gap-10">
        <p>Welcome back, {user}</p>

        <div
          onClick={() => handleSignOut()}
          className="flex gap-2 cursor-pointer"
        >
          <p>Log out</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.0"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
            ></path>
          </svg>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
