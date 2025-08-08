import React, { useState } from 'react';

// Hauptkomponente der Powerball-Lotterie-Anwendung
function App() {
  // Zustand für die ausgewählten weißen Kugeln (max. 5)
  const [selectedWhiteBalls, setSelectedWhiteBalls] = useState([]);
  // Zustand für die ausgewählte Powerball-Zahl (max. 1)
  const [selectedPowerball, setSelectedPowerball] = useState(null);
  // Zustand für die Authentifizierung (ob das Passwort eingegeben wurde)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Zustand für das eingegebene Passwort
  const [password, setPassword] = useState('');
  // Zustand für Fehlermeldungen bei der Passworteingabe
  const [errorMessage, setErrorMessage] = useState('');
  // Zustand für den eingegebenen Namen
  const [playerName, setPlayerName] = useState('');
  // Zustand für den Status der Datenübermittlung (z.B. 'idle', 'loading', 'success', 'error')
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  // Zustand für die Nachricht nach dem Senden
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Server-URL für die Nachrichtenübermittlung
  const serverURL = "https://mein-gewinnspiel-server.onrender.com/message";

  // Funktion zum Behandeln des Klicks auf eine weiße Kugel
  const handleWhiteBallClick = (number) => {
    // Wenn die Zahl bereits ausgewählt ist, entfernen Sie sie
    if (selectedWhiteBalls.includes(number)) {
      setSelectedWhiteBalls(selectedWhiteBalls.filter((n) => n !== number));
    } else if (selectedWhiteBalls.length < 5) {
      // Wenn weniger als 5 Zahlen ausgewählt sind, fügen Sie die Zahl hinzu
      setSelectedWhiteBalls([...selectedWhiteBalls, number].sort((a, b) => a - b));
    }
  };

  // Funktion zum Behandeln des Klicks auf eine Powerball-Zahl
  const handlePowerballClick = (number) => {
    // Wenn die Zahl bereits ausgewählt ist, deaktivieren Sie sie, sonst setzen Sie sie
    setSelectedPowerball(selectedPowerball === number ? null : number);
  };

  // Funktion zum Generieren einer Zufallszahl innerhalb eines Bereichs
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Funktion für die "Quick Pick"-Option (zufällige Auswahl)
  const handleQuickPick = () => {
    const newWhiteBalls = new Set();
    while (newWhiteBalls.size < 5) {
      newWhiteBalls.add(getRandomNumber(1, 69));
    }
    setSelectedWhiteBalls(Array.from(newWhiteBalls).sort((a, b) => a - b));
    setSelectedPowerball(getRandomNumber(1, 26));
  };

  // Funktion zum Zurücksetzen aller Auswahlen und des Namensfeldes
  const handleReset = () => {
    setSelectedWhiteBalls([]);
    setSelectedPowerball(null);
    setPlayerName('');
    setSubmissionStatus('idle');
    setSubmissionMessage('');
  };

  // Funktion zum Behandeln der Passworteingabe
  const handlePasswordSubmit = () => {
    // Einfache Passwortprüfung (ersetzen Sie 'powerball' durch Ihr gewünschtes Passwort)
    if (password === 'powerball') {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Falsches Passwort. Bitte versuchen Sie es erneut.');
    }
  };

  // Funktion zum Senden der Daten an den Server (JETZT ECHT)
  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setSubmissionMessage('Bitte geben Sie Ihren Namen ein.');
      setSubmissionStatus('error');
      return;
    }
    if (selectedWhiteBalls.length !== 5 || selectedPowerball === null) {
      setSubmissionMessage('Bitte wählen Sie 5 weiße Kugeln und 1 Powerball aus.');
      setSubmissionStatus('error');
      return;
    }

    setSubmissionStatus('loading');
    setSubmissionMessage('Sende Daten...');

    const message = `Name: ${playerName.trim()}, Weiße Kugeln: ${selectedWhiteBalls.join(', ')}, Powerball: ${selectedPowerball}`;
    const payload = { message: message };

    try {
      const response = await fetch(serverURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setSubmissionMessage('Ihre Lotteriedaten wurden erfolgreich gesendet!');
        // Optional: Formular nach erfolgreicher Übermittlung zurücksetzen
        handleReset();
      } else {
        const errorData = await response.json();
        setSubmissionStatus('error');
        setSubmissionMessage(`Fehler beim Senden: ${errorData.message || response.statusText}`);
        console.error('Serverantwort (Fehler):', errorData);
      }
    } catch (error) {
      setSubmissionStatus('error');
      setSubmissionMessage(`Netzwerkfehler: ${error.message}`);
      console.error('Fetch-Fehler:', error);
    }
  };

  // Erstellt ein Array von Zahlen für weiße Kugeln (1-69)
  const whiteBallNumbers = Array.from({ length: 69 }, (_, i) => i + 1);
  // Erstellt ein Array von Zahlen für den Powerball (1-26)
  const powerballNumbers = Array.from({ length: 26 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white flex flex-col items-center justify-center p-4 font-inter">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      
      {/* Überschrift der Anwendung */}
      <h1 className="text-5xl font-extrabold mb-8 text-yellow-400 text-center drop-shadow-lg">
        Powerball Lotterie Schein
      </h1>

      {/* Bedingtes Rendern: Passwort-Eingabe oder Lotterie-Schein */}
      {!isAuthenticated ? (
        // Passwort-Eingabe-Abschnitt
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl w-full max-w-md border border-blue-600 text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-200">
            Bitte Passwort eingeben
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePasswordSubmit();
              }
            }}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Passwort"
          />
          <button
            onClick={handlePasswordSubmit}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-blue-400"
          >
            Anmelden
          </button>
          {errorMessage && (
            <p className="text-red-400 mt-4 text-lg">{errorMessage}</p>
          )}
        </div>
      ) : (
        // Lotterie-Schein-Abschnitt
        <>
          {/* Abschnitt für die Auswahl der weißen Kugeln */}
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8 w-full max-w-4xl border border-purple-600">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-200">
              Wähle 5 weiße Kugeln (1-69)
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {whiteBallNumbers.map((number) => (
                <button
                  key={`white-${number}`}
                  onClick={() => handleWhiteBallClick(number)}
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-lg sm:text-xl font-semibold transition-all duration-200
                    ${
                      selectedWhiteBalls.includes(number)
                        ? 'bg-yellow-400 text-purple-900 shadow-lg scale-110 border-2 border-yellow-200'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-40 border border-transparent hover:border-white'
                    }
                    ${
                      selectedWhiteBalls.length >= 5 && !selectedWhiteBalls.includes(number)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }
                  `}
                  disabled={selectedWhiteBalls.length >= 5 && !selectedWhiteBalls.includes(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          {/* Abschnitt für die Auswahl des Powerballs */}
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8 w-full max-w-4xl border border-red-600">
            <h2 className="text-3xl font-bold mb-6 text-center text-red-200">
              Wähle 1 Powerball (1-26)
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {powerballNumbers.map((number) => (
                <button
                  key={`powerball-${number}`}
                  onClick={() => handlePowerballClick(number)}
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-lg sm:text-xl font-semibold transition-all duration-200
                    ${
                      selectedPowerball === number
                        ? 'bg-red-600 text-white shadow-lg scale-110 border-2 border-red-200'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-40 border border-transparent hover:border-white'
                    }
                  `}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          {/* Anzeige der ausgewählten Zahlen, Namenseingabe und Aktions-Buttons */}
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl w-full max-w-4xl text-center border border-blue-600">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-200">
              Deine Auswahl & Absenden
            </h2>
            
            {/* Namens-Eingabefeld */}
            <div className="mb-6">
              <label htmlFor="playerName" className="block text-xl font-semibold mb-2 text-gray-200">
                Dein Name:
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full max-w-xs p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Name eingeben"
              />
            </div>

            {/* Anzeige der ausgewählten Zahlen */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              {/* Anzeige der ausgewählten weißen Kugeln */}
              {selectedWhiteBalls.length > 0 ? (
                selectedWhiteBalls.map((number) => (
                  <span
                    key={`selected-white-${number}`}
                    className="bg-yellow-400 text-purple-900 text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2 border-yellow-200 animate-bounce-in"
                  >
                    {number}
                  </span>
                ))
              ) : (
                <span className="text-xl text-gray-300">Wähle 5 weiße Kugeln</span>
              )}
              {/* Trennzeichen */}
              <span className="text-4xl font-extrabold text-white mx-4">+</span>
              {/* Anzeige des ausgewählten Powerballs */}
              {selectedPowerball !== null ? (
                <span
                  key="selected-powerball"
                  className="bg-red-600 text-white text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2 border-red-200 animate-bounce-in"
                >
                  {selectedPowerball}
                </span>
              ) : (
                <span className="text-xl text-gray-300">Wähle 1 Powerball</span>
              )}
            </div>

            {/* Aktions-Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <button
                onClick={handleQuickPick}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-green-400"
              >
                Quick Pick
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-400"
              >
                Zurücksetzen
              </button>
            </div>

            {/* Absende Button */}
            <button
              onClick={handleSubmit}
              disabled={submissionStatus === 'loading'}
              className={`
                px-8 py-4 text-xl font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-2
                ${
                  submissionStatus === 'loading'
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 border-blue-500'
                }
                text-white mt-4
              `}
            >
              {submissionStatus === 'loading' ? 'Sende...' : 'Absenden'}
            </button>

            {/* Status- oder Fehlermeldung */}
            {submissionMessage && (
              <p className={`mt-4 text-lg ${
                submissionStatus === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {submissionMessage}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
