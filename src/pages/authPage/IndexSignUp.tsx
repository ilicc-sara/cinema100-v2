import { useState } from "react";
import { Link } from "react-router";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";

type inputsType = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

function AuthSignUp() {
  const [inputs, setInputs] = useState<inputsType>({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Sign Up
  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("There was a problem signing up:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  function handleInputsChange(e: any) {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  const addNewUser = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    // Signing up new user as authentication
    try {
      const result = await signUpNewUser(inputs.email, inputs.password);

      if (result.success) {
        navigate("/signin");
      }
    } catch (error) {
      setError("an error occured");
      toast.error("an error occured");
    } finally {
      setLoading(false);
    }
    // Collecting user data in supabase table
    try {
      const { error } = await supabase.from("users").insert([inputs]).single();
      if (error) {
        console.error("Error adding user", error.message);
        toast.error(error.message);
        setError(error.message);
        return;
      } else {
        navigate("/login");
        setInputs({
          name: "",
          lastName: "",
          email: "",
          password: "",
        });
      }
    } catch (error: any) {
      console.error("Error adding user", error.message);
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
        onSubmit={addNewUser}
        className="w-104 h-[fit-content] !px-14 !py-9 flex flex-col bg-[#161d2f] !mx-auto items-center gap-5 rounded-xl !my-5"
      >
        <h1 className="text-[#e8f0fe] text-3xl self-start">Sign Up</h1>

        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={inputs.name}
          handleOnChange={(e) => handleInputsChange(e)}
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={inputs.lastName}
          handleOnChange={(e) => handleInputsChange(e)}
        />

        <Input
          type="text"
          name="email"
          placeholder="Email"
          value={inputs.email}
          handleOnChange={(e) => handleInputsChange(e)}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={inputs.password}
          handleOnChange={(e) => handleInputsChange(e)}
        />

        <Button variation="auth-button">Sign Up</Button>

        <div className="flex flex-col gap-2">
          <p className="text-[#e8f0fe]">
            Already have an account?
            <Link to="/login">
              <span className="text-[#fc4747] cursor-pointer">
                &nbsp;Log In
              </span>
            </Link>
          </p>
        </div>
      </form>
      {error && <p className="text-red-600 text-center pt-4">{error}</p>}
    </section>
  );
}

export default AuthSignUp;
