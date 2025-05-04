// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter } from "next/navigation";
// import AnimatedBackground from "@/components/AnimatedBackground";

// export default function AdminDashboard() {
//   const { user, token } = useAuth();
//   const router = useRouter();

//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isUserInitialized, setIsUserInitialized] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser && !user) {
//       console.warn("User is not set in context but exists in localStorage.");
//     }

//     if (user) {
//       if (user.role !== "admin") {
//         setIsUserInitialized(true);
//         return;
//       }
//       setIsUserInitialized(true);
//     } else {
//       setIsUserInitialized(true);
//     }
//   }, [user, router]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchUsers();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   if (!isUserInitialized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#eee]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">
//             {" "}
//             <Image 
//               src={"/logo.png"}
//               className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
//             />{" "}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#eee]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">
//             {" "}
//             <Image 
//               src={"/logo.png"}
//               className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
//             />{" "}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#eee] p-4 sm:p-8 relative">
//       <AnimatedBackground />
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10  relative">
//         <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
//           Admin Dashboard
//         </h1>

//         {user?.role !== "admin" ? (
//           <div className="text-red-500 text-xl">
//             You do not have permission to access this page.
//           </div>
//         ) : (
//           <>
//             <h2 className="text-2xl font-semibold mb-4">Users</h2>

//             <div className="overflow-x-auto">
//               <table className="min-w-full border border-gray-300 rounded overflow-hidden">
//                 <thead>
//                   <tr className="bg-gray-100 text-left">
//                     <th className="px-4 py-2 border">Username</th>
//                     <th className="px-4 py-2 border">Email</th>
//                     <th className="px-4 py-2 border">Role</th>
//                     <th className="px-4 py-2 border">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.length > 0 ? (
//                     users.map((u) => (
//                       <tr
//                         key={u._id}
//                         className="text-sm sm:text-base text-center"
//                       >
//                         <td className="border px-4 py-2">{u.username}</td>
//                         <td className="border px-4 py-2">{u.email}</td>
//                         <td className="border px-4 py-2 capitalize">
//                           {u.role}
//                         </td>
//                         <td className="border px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">
//                           <button
//                             className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm cursor-pointer"
//                             onClick={() =>
//                               router.push(`/dashboard/users/${u._id}/edit`)
//                             }
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
//                             onClick={async () => {
//                               if (
//                                 confirm(
//                                   "Are you sure you want to delete this user?"
//                                 )
//                               ) {
//                                 await fetch(
//                                   `${process.env.NEXT_PUBLIC_API_URL}/users/${u._id}`,
//                                   {
//                                     method: "DELETE",
//                                     headers: {
//                                       Authorization: `Bearer ${token}`,
//                                     },
//                                   }
//                                 );
//                                 router.refresh();
//                               }
//                             }}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="text-center px-4 py-6 text-gray-500"
//                       >
//                         No users found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from 'next/image';
// تعريف واجهة User
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]); // استخدام النوع المحدد بدلاً من any
  const [loading, setLoading] = useState(true);
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      console.warn("User is not set in context but exists in localStorage.");
    }

    if (user) {
      if (user.role !== "admin") {
        setIsUserInitialized(true);
        return;
      }
      setIsUserInitialized(true);
    } else {
      setIsUserInitialized(true);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!isUserInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {" "}
            <Image 
              src={"/logo.png"}
              className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
              width={500} 
              height={300} 
            />{" "}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {" "}
            <Image 
              src={"/logo.png"}
              className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
              width={500} 
              height={300} 
            />{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eee] p-4 sm:p-8 relative">
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10  relative">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {user?.role !== "admin" ? (
          <div className="text-red-500 text-xl">
            You do not have permission to access this page.
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Users</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">Username</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Role</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr
                        key={u._id}
                        className="text-sm sm:text-base text-center"
                      >
                        <td className="border px-4 py-2">{u.username}</td>
                        <td className="border px-4 py-2">{u.email}</td>
                        <td className="border px-4 py-2 capitalize">
                          {u.role}
                        </td>
                        <td className="border px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">
                          <button
                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/users/${u._id}/edit`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this user?"
                                )
                              ) {
                                await fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL}/users/${u._id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                router.refresh();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center px-4 py-6 text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

