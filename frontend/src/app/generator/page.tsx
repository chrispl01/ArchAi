'use client';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import BackButton from '@/components/BackButton';

export default function Generator() {
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState(
    `# Hier wird dein Terraform-Code generiert\n`,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const generatedCode = `resource "aws_instance" "example" {\n  ami           = "ami-12345678"\n  instance_type = "t2.micro"\n  tags = {\n    Name = "${prompt}"\n  }\n}`;
      setCode(generatedCode);
      setSubmitted(true);
    }
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'main.tf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <BackButton></BackButton>
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
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Gib deinen Prompt ein..."
              className="w-full px-6 py-4 mb-6 text-lg rounded-4xl border-2 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
              className="w-full px-6 py-4 mb-8 text-sm rounded-xl border-1 border-gray-600 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-readonly="true"
            >
              {prompt}
            </div>

            <div className="flex flex-col items-center w-full m-auto">
              <div
                className="w-full bg-gray-800 rounded-xl shadow-lg overflow-auto text-sm border-1 border-gray-600"
                style={{ minHeight: '400px', maxHeight: '60vh' }}
              >
                <CodeMirror
                  value={code}
                  height="400px"
                  extensions={[json()]}
                  onChange={(value) => setCode(value)}
                  theme="dark"
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                  }}
                />
              </div>

              <button
                onClick={downloadCode}
                className="ml-auto my-8 font-semibold text-sm border-1 border-gray-100 px-4 py-2 rounded-4xl hover:bg-gray-600 duration-100 hover:scale-105 cursor-pointer w-40"
              >
                Download .tf
              </button>
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
