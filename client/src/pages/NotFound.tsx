import { Link } from "react-router";
export default function NotFound() {
  return (
    <div className="w-screen h-screen">
      <h1 className="text-[400px] font-bold flex items-center justify-center text-[#E4281F]">404</h1>
      <Link to="/" className="mt-4 rounded-md bg-orange-500 px-4 py-2 text-white flex w-40 mx-auto items-center justify-center">Əsas səhifəyə keç</Link>
    </div>
  );
}
