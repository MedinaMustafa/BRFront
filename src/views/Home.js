import React, { Fragment } from "react";
const Home = () => {
  const backgroundImageUrl =
  "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // Replace with your image URL

  return <Fragment>
    <div>
      <div
        className="relative w-full h-[80vh]  rounded-3xl	 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="flex items-center justify-center rounded-3xl	 w-full h-full bg-black bg-opacity-50">
          <div className="text-center text-white w-[90%] sm:w-[50%]">
            <h1 className="text-4xl font-bold">Welcome to Better Read !</h1>
            <p className="text-xl mt-2">
              our ultimate destination for book reviews and ratings! Join our
              community of readers and explore honest, insightful critiques
              across all genres. Find your next favorite book and share your
              opinions with fellow book enthusiasts. Dive in and let the ratings
              guide your reading journey
            </p>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
};

export default Home;
