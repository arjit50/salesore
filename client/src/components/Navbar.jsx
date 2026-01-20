import { Link } from "react-router-dom";

const Navbar = () => (
 <nav className="flex items-center justify-between px-10 py-5">
         <h1 className="text-2xl font-bold text-blue-600">Salesor</h1>
 
         <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
           <Link to="/" className="cursor-pointer hover:text-blue-600">Home</Link>
           <Link to="/pricing" className="cursor-pointer hover:text-blue-600">Pricing</Link>
           <Link to="/info" className="cursor-pointer hover:text-blue-600">Info</Link>
           <Link to="/contact" className="cursor-pointer hover:text-blue-600">Contact</Link>
         </ul>
 
         <div className="flex gap-4 items-center">
           <Link to="/login" className="text-gray-700 font-medium">
             Log in
           </Link>
           <Link
             to="/signup"
             className="bg-black text-white px-4 py-2 rounded-md"
           >
             Sign Up
           </Link>
         </div>
       </nav>
 
);


export default Navbar