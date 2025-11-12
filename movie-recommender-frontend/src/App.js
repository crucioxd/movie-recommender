import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    if (!movie.trim()) return;
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      // ✅ Use 127.0.0.1 instead of localhost to avoid Windows Axios bug
      const response = await axios.post(
        "https://movie-recommender-backend.onrender.com/recommend",
        { movie }
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Could not fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content-box">
        <h1 className="title">Movie Recommender</h1>
        <input
          type="text"
          placeholder="Enter a movie name..."
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className="input-box"
        />
        <button onClick={fetchRecommendations} className="btn">
          {loading ? "Loading..." : "Get Recommendations"}
        </button>

        {error && <p className="error">{error}</p>}

        <div className="results">
          {recommendations.length > 0 && (
            <ul className="fade-in">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-contrast">
                  {rec}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
