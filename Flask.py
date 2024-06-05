from flask import Flask, request, jsonify
from fuzzywuzzy import process
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Read players from players.txt
with open('playersEPL.txt', 'r', encoding='utf-8') as file:
    player_list = [player.strip() for player in file.readlines()]

# Create a dictionary to store player name and position separately
player_dict = {}
for player in player_list:
    name, position = player.rsplit(', ', 1)
    player_dict[name] = position

@app.route('/search', methods=['POST'])
def search_players():
    data = request.json
    search_string = data.get('search_string', '')

    # Using fuzzywuzzy's process.extract function to get best matches
    matches = process.extract(search_string, player_dict.keys(), limit=10)
    best_matches = [{'name': match[0], 'position': player_dict[match[0]]} for match in matches]

    return jsonify(best_matches)

if __name__ == "__main__":
    app.run(debug=True)