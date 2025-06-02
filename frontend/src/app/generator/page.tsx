'use client';
import { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { BackButton } from '@/components/BackButton';
import { Prompt } from '@/models/dtos/Prompt';
import { Completion } from '@/models/dtos/Completion';
import { getCode } from '@/controller/GeneratorController';
import ErrorModal from '@/components/ErrorModal';
import { Loadingscreen } from '@/components/LoadingScreen';

export default function Generator() {
  const [prompt, setPrompt] = useState<Prompt>(new Prompt());
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState<Completion>(new Completion());
  const [errormodal, setError] = useState('');
  const [loadingscreen, setLoadingscreen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingscreen(true);

    if (prompt.prompt.trim()) {
      try {
        const generatedCode = await getCode(prompt);
        setSubmitted(true);
        setCode(generatedCode);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
      setLoadingscreen(false);
    }
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code.message], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'main.tf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt({ prompt: e.target.value });

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset height
      const maxHeight = 6 * 24;
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxHeight) + 'px';
    }
  };

  return (
    <>
      {loadingscreen && <Loadingscreen />}
      {errormodal && <ErrorModal message={errormodal} onClose={() => setError('')} />}

      {!submitted && <BackButton />}

      <div className="flex flex-col justify-center items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-screen-xl mx-auto">
        {!submitted && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center px-2">
            Let&apos;s generate your terraform cloud architecture...
          </h1>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-3xl">
            <textarea
              ref={textareaRef}
              value={prompt.prompt}
              onChange={handleChange}
              placeholder="Describe your cloud architecture..."
              className="w-full px-4 py-3 mb-6 text-base sm:text-lg rounded-3xl border-2 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none transition-shadow duration-150"
              style={{ maxHeight: '144px', overflowY: 'auto', boxSizing: 'border-box' }}
              required
              rows={3}
            />

            <button
              type="submit"
              className="w-36 sm:w-40 text-lg font-semibold border border-gray-300 rounded-3xl py-2 hover:bg-gray-600 hover:text-white transition duration-150 transform hover:scale-105"
            >
              generate!
            </button>
          </form>
        )}

        {submitted && (
          <div className="w-full max-w-4xl flex flex-col">
            <div
              className="w-full px-6 py-4 mb-8 text-sm rounded-4xl border-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-pre-wrap overflow-auto"
              style={{ maxHeight: '144px' }}
              aria-readonly="true"
            >
              {prompt.prompt}
            </div>

            <div className="flex flex-col items-center w-full mx-auto">
              <div className="w-full bg-gray-900 rounded-xl shadow-lg overflow-auto border border-gray-700">
                <CodeMirror
                  value={code.message}
                  height="600px"
                  extensions={[json()]}
                  onChange={(value) => setCode((prev) => ({ ...prev, message: value }))}
                  theme="dark"
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between w-full mt-8 gap-4 sm:gap-0">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-40 font-semibold text-sm border border-gray-300 rounded-3xl py-2 hover:bg-gray-600 hover:text-white transition duration-150 transform hover:scale-105"
                >
                  Reload
                </button>
                <button
                  onClick={downloadCode}
                  className="w-full sm:w-40 font-semibold text-sm border border-gray-300 rounded-3xl py-2 hover:bg-gray-600 hover:text-white transition duration-150 transform hover:scale-105"
                >
                  Download .tf
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .cm-editor {
          display: block !important;
          background-color: #1f2937;
          max-width: 100%;
          font-size: 0.9rem;
        }

        .cm-editor .cm-scroller {
          overflow: auto !important;
          max-height: 600px; /* fixe Höhe für Scroll */
          max-width: 100%;
          padding-right: 0 !important;
          margin-right: 0 !important;
        }

        .cm-editor .cm-content {
          white-space: pre !important;
        }

        /* Äußerer Container ohne Scroll */
        .w-full.bg-gray-800.rounded-xl.shadow-lg.text-sm.border-1.border-gray-600 {
          padding-right: 0 !important;
        }

        @media (max-width: 640px) {
          /* Auf kleinen Bildschirmen Textarea und Buttons anpassen */
          textarea {
            font-size: 1rem !important;
          }

          .cm-editor {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </>
  );
}
