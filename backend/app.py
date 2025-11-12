from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)

# ✅ Allow frontend (React) running on localhost:3000 to access this backend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# ✅ Load your saved data files
new_df = pd.read_csv('movies.csv')
with open('similarity.pkl', 'rb') as f:
    similarity = pickle.load(f)


def recommend(movie):
    try:
        movie_index = new_df[new_df['title'].str.lower() ==
                             movie.lower()].index[0]
        distances = similarity[movie_index]
        movies_list = sorted(list(enumerate(distances)),
                             reverse=True, key=lambda x: x[1])[1:6]
        recommended_movies = [new_df.iloc[i[0]].title for i in movies_list]
        return recommended_movies
    except Exception as e:
        print("Recommendation error:", e)
        return []


@app.route('/recommend', methods=['POST'])
def recommend_api():
    data = request.get_json()
    movie = data.get('movie')
    if not movie:
        return jsonify({'error': 'No movie provided'}), 400
    recommendations = recommend(movie)
    return jsonify({'recommendations': recommendations})


if __name__ == '__main__':
    # ✅ Run on 0.0.0.0 so it’s accessible via both localhost and 127.0.0.1
    app.run(debug=True, host='0.0.0.0', port=5000)
