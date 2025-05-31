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
import { loadComponents } from 'next/dist/server/load-components';

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
      } catch (error: any) {
        setError(error.message);
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
      const maxHeight = 6 * 24; // 5 Zeilen x 24px Höhe (ungefähr)
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, maxHeight) + 'px';
    }
  };

  return (
    <>

    {loadingscreen &&
    <Loadingscreen/>}
      {errormodal && (
        <ErrorModal message={errormodal} onClose={() => setError('')} />
      )}

      {!submitted && <BackButton></BackButton>}
      <div className="flex flex-col justify-center items-center w-full">
        {!submitted && (
          <h1 className="text-3xl font-bold mb-12">
            Let's generate your terraform cloud architecture...
          </h1>
        )}

        {!submitted && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-3xl"
          >
            <textarea
              ref={textareaRef}
              value={prompt.prompt}
              onChange={handleChange}
              placeholder="Describe your cloud architecture..."
              rows={1}
              className="w-full px-6 py-4 mb-6 text-lg rounded-4xl border-2 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
              style={{ maxHeight: '144px', overflowY: 'auto' }}
              required
            />

            <button className="mt-6 text-lg border-1 border-gray-100 px-4 py-2 rounded-4xl hover:bg-gray-600 duration-100 hover:scale-105 cursor-pointer w-40">
              generate!
            </button>
          </form>
        )}

        {submitted && (
          <div className="w-full max-w-4xl">
            <div
              className="w-full px-6 py-4 mb-8 text-sm rounded-4xl border-1 focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-pre-wrap overflow-auto"
              style={{ maxHeight: '144px' }} // max. Höhe wie Textarea
              aria-readonly="true"
            >
              {prompt.prompt}
            </div>

            <div className="flex flex-col items-center w-full m-auto">
              <div
                className="w-full bg-gray-800 rounded-xl shadow-lg overflow-auto text-sm border-1 border-gray-600">
                <CodeMirror
                  value={code.message}
                  height="600px"
                  extensions={[json()]}
                  onChange={(value) =>
                    setCode((prev) => ({ ...prev, message: value }))
                  }
                  theme="dark"
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                  }}
                />
              </div>

              <div className="flex flex-row w-full justify-between">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setPrompt(new Prompt());
                  }}
                  className="my-8 font-semibold text-sm border-1 border-gray-100 px-4 py-2 rounded-4xl hover:bg-gray-600 duration-100 hover:scale-105 cursor-pointer w-40"
                >
                  Reload
                </button>
                <button
                  onClick={downloadCode}
                  className="my-8 font-semibold text-sm border-1 border-gray-100 px-4 py-2 rounded-4xl hover:bg-gray-600 duration-100 hover:scale-105 cursor-pointer w-40"
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
          display: grid !important;
          grid-template-columns: auto 1fr !important;
          column-gap: 12px !important;
          background-color: #1f2937;
        }
      `}</style>
    </>
  );
}
