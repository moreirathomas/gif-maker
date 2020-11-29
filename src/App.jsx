import React, { useState, useEffect } from 'react';
import './App.css';
import './fontello/css/fontello-embedded.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [converting, setconverting] = useState(false);
  const [outFilename, setOutFilename] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    setconverting(true);

    ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(video));

    await ffmpeg.run('-i', 'in.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif'); // prettier-ignore

    const data = ffmpeg.FS('readFile', 'out.gif');

    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );

    setconverting(false);
    setGif(url);
    setOutFilename(video.name.replace('mp4', 'gif'));
  };

  useEffect(() => {
    load();
  }, []);

  const AppHeader = () => {
    return (
      <header>
        <h1>gifmakr</h1>
        <div>
          <p className="lead">Upload a video file and convert it to gif.</p>
          <p className="links">
            <a
              href="https://github.com/moreirathomas"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-github-circled"></i>
            </a>
          </p>
        </div>
      </header>
    );
  };

  const AppFooter = () => {
    return (
      <footer>
        <p>
          Made with{' '}
          <a
            href="http://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>{' '}
          and{' '}
          <a
            href="https://ffmpeg.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            FFmpeg
          </a>
          .
        </p>
      </footer>
    );
  };

  return ready ? (
    <div className="App">
      <AppHeader />

      <main>
        <div className="input-container">
          <h2>Video input</h2>

          <input
            type="file"
            aria-label="Upload video"
            className="custom-file-input"
            onChange={(e) => setVideo(e.target.files?.item(0))}
          />

          {video && (
            <div className="input-video">
              <pre>{video.name}</pre>
              <video controls src={URL.createObjectURL(video)}></video>
            </div>
          )}
        </div>

        <div className="output-container">
          <h2>Gif output</h2>

          {!gif && (
            <button disabled={!video} onClick={convertToGif}>
              Convert
            </button>
          )}

          {converting && <pre>Convertion in progress...</pre>}

          {gif && (
            <div className="output-gif">
              <a href={gif} download={outFilename}>
                Download
              </a>
              <pre>{outFilename}</pre>
              <img src={gif} />
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  ) : (
    <div className="App loading">Loading...</div>
  );
}

export default App;
