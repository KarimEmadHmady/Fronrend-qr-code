// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import AnimatedBackground from "@/components/AnimatedBackground";

// const MealDetailsPage = () => {
//   const { mealId } = useParams();
//   const { isAuthenticated, user } = useAuth();
//   const [meal, setMeal] = useState(null);
//   const [review, setReview] = useState({ rating: 0, comment: "" });
//   const [hoverRating, setHoverRating] = useState(0);
//   const [isReviewing, setIsReviewing] = useState(false);

//   useEffect(() => {
//     const fetchMeal = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}`
//         );
//         const data = await res.json();
//         setMeal(data);
//       } catch (err) {
//         console.error("Error fetching meal:", err);
//       }
//     };

//     if (mealId) fetchMeal();
//   }, [mealId]);

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       alert("You need to be logged in to add a review!");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}/reviews`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ ...review, userId: user.id }),
//         }
//       );

//       if (res.ok) {
//         alert("Review added successfully!");
//         setIsReviewing(true);
//         setReview({ rating: 0, comment: "" });
//         setMeal((prev) => ({
//           ...prev,
//           reviews: [...prev.reviews, { ...review, name: user.username }],
//         }));
//       } else {
//         alert("Failed to add review.");
//       }
//     } catch (err) {
//       console.error("Error adding review:", err);
//     }
//   };

//   if (!meal) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#eee]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">
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
//     <div className="container mx-auto px-4 py-8 ">
//       <AnimatedBackground />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {/* Meal Details */}
//         <div>
//           <Image 
//             src={meal.image}
//             alt={meal.name || "meal image"}
//             className="w-full h-auto object-cover rounded-xl shadow-md"
//           />
//           <h1 className="text-3xl font-bold mt-4 text-gray-800">{meal.name}</h1>
//           <p className="text-lg text-gray-600 mt-3">{meal.description}</p>
//           <p className="text-xl text-green-600 font-semibold mt-2">
//             السعر: L.E {meal.price}
//           </p>

//           <p className="mt-2 text-gray-700 font-medium">
//             التقييم العام:
//             {meal.reviews && meal.reviews.length > 0
//               ? ` ${(
//                   meal.reviews.reduce((sum, r) => sum + r.rating, 0) /
//                   meal.reviews.length
//                 ).toFixed(1)} من 5 (${meal.reviews.length} تقييم)`
//               : " لا يوجد تقييم"}
//           </p>

//           {/* Reviews */}
//           <h2 className="text-2xl font-semibold mt-10 mb-4">التعليقات:</h2>
//           <ul className="space-y-4">
//             {meal.reviews && meal.reviews.length > 0 ? (
//               meal.reviews.map((rev, i) => (
//                 <li
//                   key={rev._id || i}
//                   className="bg-gray-100 rounded-lg p-2 shadow-sm"
//                 >
//                   <p className="font-semibold text-gray-800">{rev.name}</p>
//                   <div className="flex items-center my-1">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <svg
//                         key={star}
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill={star <= rev.rating ? "#facc15" : "#e5e7eb"}
//                         className="w-5 h-5"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <p className="text-gray-600">{rev.comment}</p>
//                 </li>
//               ))
//             ) : (
//               <p className="text-gray-500">لا توجد تعليقات حتى الآن.</p>
//             )}
//           </ul>
//         </div>

//         {/* Review Form */}
//         <form
//           onSubmit={handleReviewSubmit}
//           className="bg-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 h-fit"
//         >
//           <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//             أضف تقييمك
//           </h3>
//           <div className="mb-4">
//             <label className="block mb-2 font-medium text-gray-700">
//               التقييم:
//             </label>
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <svg
//                   key={star}
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill={
//                     star <= (hoverRating || review.rating)
//                       ? "#facc15"
//                       : "#e5e7eb"
//                   }
//                   viewBox="0 0 24 24"
//                   className="w-6 h-6 cursor-pointer transition-transform hover:scale-110"
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   onClick={() => setReview({ ...review, rating: star })}
//                 >
//                   <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                 </svg>
//               ))}
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block mb-2 font-medium text-gray-700">
//               تعليقك:
//             </label>
//             <textarea
//               value={review.comment}
//               onChange={(e) =>
//                 setReview({ ...review, comment: e.target.value })
//               }
//               required
//               className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="اكتب تعليقك هنا..."
//             />
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-2 rounded-lg font-semibold text-white transition cursor-pointer ${
//               isAuthenticated
//                 ? "bg-[#222] hover:bg-[#000]"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//             disabled={!isAuthenticated}
//           >
//             إرسال التقييم
//           </button>

//           {!isAuthenticated && (
//             <p className="text-red-500 mt-3 text-sm text-center">
//               يجب تسجيل الدخول لكتابة تقييم.
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MealDetailsPage;














"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from 'next/image';
const MealDetailsPage = () => {
  const params = useParams();
const mealId = params?.mealId as string;

  const { isAuthenticated, user } = useAuth();
  const [meal, setMeal] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);


  const fetchMeal = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}`);
      const data = await res.json();
      setMeal(data);
    } catch (err) {
      console.error("Error fetching meal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mealId) fetchMeal();
  }, [mealId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("يجب تسجيل الدخول لإضافة تقييم.");
      return;
    }

    if (!review.rating || !review.comment.trim()) {
      alert("يرجى تعبئة كل الحقول.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...review, userId: user.id }),
        }
      );

      if (res.ok) {
        alert("تمت إضافة التقييم بنجاح!");
        setReview({ rating: 0, comment: "" });
        fetchMeal();
      } else {
        alert("فشل في إرسال التقييم.");
      }
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <Image
          src="/logo.png"
          alt="شعار التطبيق"
          width={150}
          height={150}
          className="object-center block mx-auto mb-6"
        />
      </div>
    </div>
    );
  }

  if (!meal) return <p className="text-center mt-10 text-gray-500">لم يتم العثور على الوجبة.</p>;

  const avgRating = meal.reviews?.length
    ? (meal.reviews.reduce((sum, r) => sum + r.rating, 0) / meal.reviews.length).toFixed(1)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedBackground />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <Image 
            src={meal.image}
            alt={meal.name || "meal image"}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
          <h1 className="text-3xl font-bold mt-4 text-gray-800">{meal.name}</h1>
          <p className="text-lg text-gray-600 mt-3">{meal.description}</p>
          <p className="text-xl text-green-600 font-semibold mt-2">
            السعر: L.E {meal.price}
          </p>

          <p className="mt-2 text-gray-700 font-medium">
            التقييم العام:
            {avgRating ? ` ${avgRating} من 5 (${meal.reviews.length} تقييم)` : " لا يوجد تقييم"}
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">التعليقات:</h2>
          <ul className="space-y-4">
            {meal.reviews?.length ? (
              meal.reviews.map((rev, i) => (
                <li key={rev._id || i} className="bg-gray-100 rounded-lg p-2 shadow-sm">
                  <p className="font-semibold text-gray-800">{rev.name}</p>
                  <div className="flex items-center my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={star <= rev.rating ? "#facc15" : "#e5e7eb"}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600">{rev.comment}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">لا توجد تعليقات حتى الآن.</p>
            )}
          </ul>
        </div>

        <form
          onSubmit={handleReviewSubmit}
          className="bg-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 h-fit"
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">أضف تقييمك</h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">التقييم:</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={star <= (hoverRating || review.rating) ? "#facc15" : "#e5e7eb"}
                  viewBox="0 0 24 24"
                  className="w-6 h-6 cursor-pointer transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReview({ ...review, rating: star })}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">تعليقك:</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="اكتب تعليقك هنا..."
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-white transition cursor-pointer ${
              isAuthenticated ? "bg-[#222] hover:bg-[#000]" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isAuthenticated}
          >
            إرسال التقييم
          </button>

          {!isAuthenticated && (
            <p className="text-red-500 mt-3 text-sm text-center">
              يجب تسجيل الدخول لكتابة تقييم.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default MealDetailsPage;

