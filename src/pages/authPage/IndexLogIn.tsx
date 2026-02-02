import { useState } from "react";
import { Link } from "react-router";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { supabase } from "../../supabase-client";

const DEMO_USER_MAIL = "demouser@gmail.com";
const DEMO_USER_PASSWORD = "demouser";

function AuthLogIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const logInUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      console.log("sign-in success:", data);
      navigate("/");
    } catch (error: any) {
      setError(`an error occured ${error}`);
      toast.error("error logging in");
    } finally {
      setLoading(false);
    }
  };

  const guestLogIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      console.log("sign-in success:", data);
      navigate("/");
    } catch (error: any) {
      setError(`an error occured ${error}`);
      toast.error("error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen !mt-[5%]">
      <ToastContainer position="top-center" />
      {loading && <div className="loader"></div>}
      <div className="w-[fit-content] !mx-auto flex justify-center items-center gap-2">
        <img className="w-12 h-12" src="logo.png" />
        <h1 className="text-white font-medium text-xl">cinema 100</h1>
      </div>

      <form
        onSubmit={logInUser}
        className="w-104 h-[fit-content] !px-14 !py-9 flex flex-col bg-[#161d2f] !mx-auto items-center gap-5 rounded-xl !my-5"
      >
        <h1 className="text-[#e8f0fe] text-3xl self-start">Log In</h1>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          handleOnChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          handleOnChange={(e) => setPassword(e.target.value)}
        />

        <Button variation="auth-button">Log In</Button>

        <div className="flex flex-col gap-2">
          <p className="text-[#e8f0fe]">
            Don't have an account ?{" "}
            <Link to="/signup">
              <span className="text-[#fc4747] cursor-pointer">Sign up</span>
            </Link>
          </p>
          <p className="text-[#e8f0fe]">
            Or,
            {/* <Link to="/"> */}
            <span
              onClick={() => guestLogIn(DEMO_USER_MAIL, DEMO_USER_PASSWORD)}
              className="text-[#fc4747] cursor-pointer"
            >
              &nbsp; Log in as guest
            </span>
            {/* </Link> */}
          </p>
        </div>
      </form>
      {error && <p className="text-red-600 text-center pt-4">{error}</p>}
    </section>
  );
}

export default AuthLogIn;
