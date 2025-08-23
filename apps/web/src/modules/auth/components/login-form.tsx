import { Eye, EyeOff } from "lucide-react";

import { Button, FormField, Input } from "@/web/components/ui";
import { Spinner } from "@/web/components/ui/spinner";
import { useLoginForm } from "@/web/modules/auth/components/login-form.hook";

export const LoginForm = () => {
  const {
    errors,
    handleSubmit,
    isLoading,
    isValid,
    onSubmit,
    register,
    showPassword,
    togglePasswordVisibility,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Email"
        id="email"
        type="email"
        placeholder="Enter your email"
        error={errors.email}
        register={register("email")}
      />

      <FormField
        label="Password"
        id="password"
        error={errors.password}
        className="relative"
        register={register("password")}
      >
        <div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </FormField>

      <div className="mt-8">
        <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
          {isLoading
? (
            <>
              <Spinner className="mr-1" />
              <span>Signing In...</span>
            </>
          )
: (
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  );
};
