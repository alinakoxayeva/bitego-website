import { Link } from "react-router";

export default function Forbidden() {
  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="mt-2 text-gray-600">Bu səhifəyə giriş icazəniz yoxdur.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Ana səhifəyə qayıt
      </Link>
    </div>
  );
}