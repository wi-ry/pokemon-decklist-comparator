# Pokémon TCG Decklist Comparator

This project is a web application that allows users to compare two Pokémon Trading Card Game (TCG) decklists. It highlights the differences between the two decklists, showing additions, removals, and changes side-by-side.

## Features

- Compare two Pokémon TCG decklists.
- Highlight additions, removals, and changes in the decklists.
- User-friendly interface for viewing comparison results.

## Project Structure

```
src
├── app.js          # Entry point of the application
├── compare.js      # Logic for comparing decklists
├── views
│   └── index.ejs   # Template for rendering comparison results
└── utils
    └── parser.js    # Utility functions for parsing decklists
public
└── styles.css      # Styles for the application
package.json        # npm configuration file
README.md           # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/wi-ry/pokemon-decklist-comparator.git
   ```
2. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Open your web browser and go to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
