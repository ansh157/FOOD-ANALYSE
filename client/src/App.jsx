import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [menuText, setMenuText] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Upload a menu image or enter the menu text and click Analyze.');

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPhotoFile(file || null);
    setAnalysis(null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAnalysis(null);
    setMessage('Analyzing...');

    try {
      const formData = new FormData();
      formData.append('menuText', menuText);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
        setMessage(response.data.message || 'Analysis complete.');
      } else {
        setMessage('No analysis result returned.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error analyzing the menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Food Analyzer</h1>
        <p>Upload a menu or food image to estimate calories and macros.</p>
      </header>

      <main>
        <section className="upload-card">
          <form onSubmit={handleSubmit}>
            <label>
              Menu text or food description
              <textarea
                value={menuText}
                onChange={(event) => setMenuText(event.target.value)}
                placeholder="eg. Burger, pizza, salad"
              />
            </label>

            <label>
              Photo of the menu or food
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </label>

            {previewUrl && (
              <div className="preview">
                <img src={previewUrl} alt="Menu preview" />
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Menu'}
            </button>
          </form>
        </section>

        <section className="analysis-card">
          <div className="analysis-message">{message}</div>

          {analysis && (
            <>
              <div className="totals">
                <div>
                  <strong>Calories</strong>
                  <span>{analysis.totals.calories}</span>
                </div>
                <div>
                  <strong>Protein</strong>
                  <span>{analysis.totals.protein}g</span>
                </div>
                <div>
                  <strong>Carbs</strong>
                  <span>{analysis.totals.carbs}g</span>
                </div>
                <div>
                  <strong>Fat</strong>
                  <span>{analysis.totals.fat}g</span>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Carbs</th>
                    <th>Fat</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.calories}</td>
                      <td>{item.protein}g</td>
                      <td>{item.carbs}g</td>
                      <td>{item.fat}g</td>
                      <td>{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          // help center box
        </section>
      </main>
    </div>
  );
}

export default App;
