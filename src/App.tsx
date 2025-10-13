import { useState, useEffect } from 'react'
import { recognize } from "tesseract.js";
import { Upload, FileImage, Copy, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);


  // Función para manejar el pegado de imágenes
  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setFile(imageUrl);
          setText("");
          break;
        }
      }
    }
  };

  // Agregar event listener para Ctrl+V
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(URL.createObjectURL(f));
      setText("");
    }
  };

  const runTesseract = async () => {
    if (!file) return alert("Sube o pega una imagen primero.");
    setWorking(true);
    setProgress(0);
    
    try {
      const { data } = await recognize(file, 'spa+eng', {
        logger: m => {
          if (m.status === "recognizing text" && m.progress) {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      setText(data.text);
    } catch (err) {
      console.error(err);
      alert("Error en OCR: " + (err as Error).message);
    } finally {
      setWorking(false);
    }
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'texto-extraido.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3 sm:mb-4">
            <FileImage className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            TextCapture OCR
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Extrae texto de imágenes y capturas de pantalla de forma rápida y precisa. 
            Sube una imagen o pega una captura con <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-xs sm:text-sm font-mono">Ctrl+V</kbd>
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Upload Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Subir Imagen
              </h2>
              
              {/* File Upload */}
              <div className="mb-4 sm:mb-6">
                <label className="block">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 font-medium">Haz clic para seleccionar una imagen</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">o arrastra y suelta aquí</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={runTesseract}
                  disabled={working || !file}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                >
                  {working ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Procesando... {progress}%</span>
                      <span className="sm:hidden">{progress}%</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">Extraer Texto (OCR)</span>
                      <span className="sm:hidden">Extraer Texto</span>
                    </>
                  )}
                </button>

                {working && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Preview */}
            {file && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Vista Previa</h3>
                <div className="relative">
                  <img
                    src={file}
                    alt="Preview"
                    className="w-full rounded-lg sm:rounded-xl shadow-sm border border-gray-200"
                  />
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black bg-opacity-50 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                    Imagen cargada
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Texto Extraído
                </h2>
                {text && (
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={copyText}
                      className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Copiar texto"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <button
                      onClick={downloadText}
                      className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Descargar texto"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-xs sm:text-sm"
                placeholder="El texto extraído aparecerá aquí... Puedes editarlo directamente."
              />

              {text && (
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  {text.length} caracteres extraídos
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">💡 Consejos para mejores resultados</h3>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2">
                <li>• Usa imágenes con texto claro y buen contraste</li>
                <li>• Evita imágenes borrosas o con poca resolución</li>
                <li>• El texto debe estar horizontal para mejor reconocimiento</li>
                <li>• Soporta español e inglés automáticamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
