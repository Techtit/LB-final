import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Link, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link to="/">
            <img src={logo} alt="Lalisa Belle" className="h-14 mx-auto mb-4" />
          </Link>
        </div>

        {isLogin ? (
          <SignIn
            routing="hash"
            signUpUrl="/auth"
            fallbackRedirectUrl={returnTo}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-border rounded-xl bg-background",
              },
            }}
          />
        ) : (
          <SignUp
            routing="hash"
            signInUrl="/auth"
            fallbackRedirectUrl={returnTo}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-border rounded-xl bg-background",
              },
            }}
          />
        )}

        <p className="text-center text-sm text-muted-foreground font-sans">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
